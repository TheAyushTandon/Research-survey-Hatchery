'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { QuestionnaireConfig, RespondentInfo, ResponseValue, SessionData } from '../lib/types';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { IntakeScreen } from './IntakeScreen';
import { QuestionRenderer } from './QuestionRenderer';
import { ReviewScreen } from './ReviewScreen';
import { CompletionScreen } from './CompletionScreen';
import { generatePdfReport } from '../lib/pdfReport';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface QuestionnaireRunnerProps {
  config: QuestionnaireConfig;
  defaultToken?: string;
  apiPrefix?: string;
}

export function QuestionnaireRunner({
  config,
  defaultToken = '',
  apiPrefix = '/api',
}: QuestionnaireRunnerProps) {
  // Starts directly on INTAKE - no token gating or session ID prompt for the respondent
  const [screen, setScreen] = useState<'INTAKE' | 'QUESTIONS' | 'REVIEW' | 'COMPLETED'>('INTAKE');
  const [token, setToken] = useState<string>(defaultToken);

  const [session, setSession] = useState<SessionData | null>(null);
  const [responses, setResponses] = useState<Record<string, ResponseValue>>({});
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [validationError, setValidationError] = useState('');

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`sessionId_${config.id}`);
        localStorage.removeItem(`token_${config.id}`);
        localStorage.removeItem(`resumeCode_${config.id}`);
      } catch (e) {}

      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      if (urlToken) {
        setToken(urlToken);
      }
    }
  }, [config.id, defaultToken]);

  const handleIntakeSubmit = async (respondent: RespondentInfo) => {
    setAutosaveStatus('saving');
    try {
      const res = await fetch(`${apiPrefix}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token || defaultToken,
          questionnaireId: config.id,
          respondentGroup: config.targetGroup,
          respondent,
        }),
      });

      const data = await res.json();
      if (res.ok && data.session) {
        setSession(data.session);
        setAutosaveStatus('saved');
        setScreen('QUESTIONS');
        setCurrentSectionIdx(0);
        setCurrentQuestionIdx(0);
      } else {
        setAutosaveStatus('error');
        alert(data.error || 'Failed to initialize session. Please try again.');
      }
    } catch (e) {
      setAutosaveStatus('error');
      alert('Network error initializing session. Please check your connection.');
    }
  };

  const currentSection = config.sections[currentSectionIdx];
  const currentQuestion = currentSection?.questions[currentQuestionIdx];

  const isQuestionVisible = (q: any) => {
    if (!q.conditional) return true;
    const parentAnswer = responses[q.conditional.questionId]?.value;
    return parentAnswer === q.conditional.equals;
  };

  useEffect(() => {
    if (screen === 'QUESTIONS' && currentQuestion) {
      if (!isQuestionVisible(currentQuestion)) {
        handleNextQuestion();
      }
    }
  }, [screen, currentSectionIdx, currentQuestionIdx, responses]);

  const handleAnswerChange = (value: string | string[], otherText?: string) => {
    setValidationError('');
    if (!currentQuestion || !session) return;

    const newRes: ResponseValue = {
      value,
      otherText,
      answeredAt: new Date().toISOString(),
    };

    setResponses((prev) => {
      const updated = { ...prev, [currentQuestion.id]: newRes };

      config.sections.forEach((s) => {
        s.questions.forEach((q) => {
          if (q.conditional && q.conditional.questionId === currentQuestion.id) {
            if (value !== q.conditional.equals) {
              delete updated[q.id];
            }
          }
        });
      });

      return updated;
    });

    triggerAutosave(currentQuestion, value, otherText);
  };

  const triggerAutosave = (q: any, value: any, otherText?: string) => {
    if (!session) return;
    setAutosaveStatus('saving');

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${apiPrefix}/responses/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.sessionId,
            questionnaireId: config.id,
            sectionId: currentSection.id,
            questionId: q.id,
            questionNumber: q.num,
            questionText: q.text,
            value,
            otherText,
          }),
        });

        if (res.ok) {
          setAutosaveStatus('saved');
        } else {
          setAutosaveStatus('error');
        }
      } catch (e) {
        setAutosaveStatus('error');
      }
    }, 400);
  };

  const handlePreviousQuestion = () => {
    setValidationError('');
    if (currentQuestionIdx > 0) {
      let prevIdx = currentQuestionIdx - 1;
      while (prevIdx >= 0 && !isQuestionVisible(currentSection.questions[prevIdx])) {
        prevIdx--;
      }
      if (prevIdx >= 0) {
        setCurrentQuestionIdx(prevIdx);
        return;
      }
    }

    if (currentSectionIdx > 0) {
      const prevSecIdx = currentSectionIdx - 1;
      const prevSec = config.sections[prevSecIdx];
      let prevQIdx = prevSec.questions.length - 1;
      while (prevQIdx >= 0 && !isQuestionVisible(prevSec.questions[prevQIdx])) {
        prevQIdx--;
      }
      if (prevQIdx >= 0) {
        setCurrentSectionIdx(prevSecIdx);
        setCurrentQuestionIdx(prevQIdx);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion && isQuestionVisible(currentQuestion)) {
      const answer = responses[currentQuestion.id];
      if (currentQuestion.required) {
        if (!answer || (Array.isArray(answer.value) && answer.value.length === 0) || !answer.value) {
          setValidationError('Please select an option to continue.');
          return;
        }
      }

      if (currentQuestion.type === 'limited_multi_select' && currentQuestion.maxSelections) {
        if (Array.isArray(answer?.value) && answer.value.length > currentQuestion.maxSelections) {
          setValidationError(`Please select at most ${currentQuestion.maxSelections} options.`);
          return;
        }
      }
    }

    setValidationError('');

    let nextQIdx = currentQuestionIdx + 1;
    while (nextQIdx < currentSection.questions.length) {
      if (isQuestionVisible(currentSection.questions[nextQIdx])) {
        setCurrentQuestionIdx(nextQIdx);
        return;
      }
      nextQIdx++;
    }

    if (currentSectionIdx < config.sections.length - 1) {
      let nextSecIdx = currentSectionIdx + 1;
      while (nextSecIdx < config.sections.length) {
        const nextSec = config.sections[nextSecIdx];
        const firstVis = nextSec.questions.findIndex((q) => isQuestionVisible(q));
        if (firstVis !== -1) {
          setCurrentSectionIdx(nextSecIdx);
          setCurrentQuestionIdx(firstVis);
          return;
        }
        nextSecIdx++;
      }
    }

    setScreen('REVIEW');
  };

  const handleEditFromReview = (sectionIndex: number, questionIndex: number) => {
    setCurrentSectionIdx(sectionIndex);
    setCurrentQuestionIdx(questionIndex);
    setScreen('QUESTIONS');
  };

  const handleFinalSubmit = async () => {
    if (!session) return;
    setIsSubmitting(true);
    setAutosaveStatus('saving');

    try {
      const res = await fetch(`${apiPrefix}/sessions/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          questionnaireId: config.id,
          finalResponses: responses,
        }),
      });

      const data = await res.json();
      if (res.ok && data.session) {
        setSession(data.session);
        setAutosaveStatus('saved');
        setScreen('COMPLETED');
      } else {
        alert(data.error || 'Submission failed. Please try again.');
        setAutosaveStatus('error');
      }
    } catch (e) {
      alert('Network error submitting questionnaire. Please try again.');
      setAutosaveStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!session) return;
    setIsGeneratingPdf(true);
    try {
      await generatePdfReport({
        config,
        session,
        responses,
      });
    } catch (e) {
      console.error('PDF generation error:', e);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const overallStats = useMemo(() => {
    let total = 0;
    let answered = 0;
    config.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        if (isQuestionVisible(q)) {
          total++;
          if (responses[q.id]?.value) answered++;
        }
      });
    });
    return { total, answered };
  }, [config, responses]);

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col justify-between">
      <div>
        <Header
          autosaveStatus={autosaveStatus}
          onRetrySave={() => {
            if (currentQuestion && responses[currentQuestion.id]) {
              triggerAutosave(currentQuestion, responses[currentQuestion.id].value, responses[currentQuestion.id].otherText);
            }
          }}
        />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 w-full">
          {screen === 'INTAKE' && (
            <IntakeScreen
              title={config.title}
              targetGroup={config.targetGroup}
              description={config.description}
              instructions={config.instructions}
              confidentialityNotice={config.confidentialityNotice}
              consentStatement={config.consentStatement}
              onSubmit={handleIntakeSubmit}
              isLoading={autosaveStatus === 'saving'}
            />
          )}

          {screen === 'QUESTIONS' && currentQuestion && (
            <div className="animate-fadeIn">
              <ProgressBar
                sectionTitle={currentSection.title}
                questionNumber={currentQuestion.number}
                currentQuestionIndex={currentQuestionIdx + 1}
                totalSectionQuestions={currentSection.questions.length}
                overallAnsweredCount={overallStats.answered}
                overallTotalQuestions={overallStats.total}
                canGoPrevious={currentSectionIdx > 0 || currentQuestionIdx > 0}
                onPrevious={handlePreviousQuestion}
              />

              <div className="mt-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
                <QuestionRenderer
                  question={currentQuestion}
                  response={responses[currentQuestion.id]}
                  onChange={handleAnswerChange}
                />

                {validationError && (
                  <p className="mt-4 text-xs font-semibold text-red-500 font-ubuntu">
                    {validationError}
                  </p>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePreviousQuestion}
                    disabled={currentSectionIdx === 0 && currentQuestionIdx === 0}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 font-ubuntu text-xs sm:text-sm font-medium transition flex items-center space-x-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-horizon-400 hover:bg-horizon-500 text-white font-ubuntu text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                  >
                    <span>
                      {currentSectionIdx === config.sections.length - 1 &&
                      currentQuestionIdx === currentSection.questions.length - 1
                        ? 'Review Answers'
                        : 'Continue'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {screen === 'REVIEW' && (
            <ReviewScreen
              config={config}
              responses={responses}
              onEditQuestion={handleEditFromReview}
              onConfirmSubmit={handleFinalSubmit}
              onBack={() => setScreen('QUESTIONS')}
              isSubmitting={isSubmitting}
            />
          )}

          {screen === 'COMPLETED' && session && (
            <CompletionScreen
              submissionTimestamp={session.submittedAt || new Date().toISOString()}
              onDownloadPdf={handleDownloadPdf}
              isGeneratingPdf={isGeneratingPdf}
            />
          )}
        </main>
      </div>

      <footer className="border-t border-gray-100 py-4 text-center text-[11px] text-gray-400 font-ubuntu">
        Academic Research Questionnaire Platform · Government Agencies Deployment
      </footer>
    </div>
  );
}
