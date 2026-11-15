'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { QuestionnaireConfig, RespondentInfo, ResponseValue, SessionData } from '../lib/types';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { IntakeScreen } from './IntakeScreen';
import { QuestionRenderer } from './QuestionRenderer';
import { ReviewScreen } from './ReviewScreen';
import { CompletionScreen } from './CompletionScreen';
import { ResumeModal } from './ResumeModal';
import { TokenScreen } from './TokenScreen';
import { generatePdfReport } from '../lib/pdfReport';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface QuestionnaireRunnerProps {
  config: QuestionnaireConfig;
  defaultToken?: string;
  apiPrefix?: string;
}

export function QuestionnaireRunner({
  config,
  defaultToken,
  apiPrefix = '/api',
}: QuestionnaireRunnerProps) {
  const [screen, setScreen] = useState<'TOKEN' | 'INTAKE' | 'QUESTIONS' | 'REVIEW' | 'COMPLETED'>('TOKEN');
  const [token, setToken] = useState<string>('');
  const [tokenError, setTokenError] = useState<string>('');
  const [isValidatingToken, setIsValidatingToken] = useState<boolean>(false);

  const [session, setSession] = useState<SessionData | null>(null);
  const [responses, setResponses] = useState<Record<string, ResponseValue>>({});
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [validationError, setValidationError] = useState('');

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      const storedToken = localStorage.getItem(`token_${config.id}`);
      const candidateToken = urlToken || defaultToken || storedToken || '';

      if (candidateToken) {
        validateAndSetToken(candidateToken);
      } else {
        setScreen('TOKEN');
      }
    }
  }, [config.id, defaultToken]);

  const validateAndSetToken = async (candidateToken: string) => {
    setIsValidatingToken(true);
    setTokenError('');

    try {
      const res = await fetch(`${apiPrefix}/invitations/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: candidateToken,
          expectedQuestionnaireId: config.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setToken(candidateToken);
        localStorage.setItem(`token_${config.id}`, candidateToken);

        if (typeof window !== 'undefined' && window.history.replaceState) {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }

        const cachedSessionId = localStorage.getItem(`sessionId_${config.id}`);
        if (cachedSessionId) {
          await restoreSession(cachedSessionId);
        } else {
          setScreen('INTAKE');
        }
      } else {
        setTokenError(data.error || 'The invitation token is invalid or unauthorized.');
        setScreen('TOKEN');
      }
    } catch (err) {
      setTokenError('Network error validating invitation token. Please check connection.');
      setScreen('TOKEN');
    } finally {
      setIsValidatingToken(false);
    }
  };

  const handleIntakeSubmit = async (respondent: RespondentInfo) => {
    setAutosaveStatus('saving');
    try {
      const res = await fetch(`${apiPrefix}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          questionnaireId: config.id,
          respondentGroup: config.targetGroup,
          respondent,
        }),
      });

      const data = await res.json();
      if (res.ok && data.session) {
        setSession(data.session);
        localStorage.setItem(`sessionId_${config.id}`, data.session.sessionId);
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

  const restoreSession = async (sessionIdToRestore: string, resumeCode?: string) => {
    try {
      const res = await fetch(`${apiPrefix}/sessions/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdToRestore,
          resumeCode,
          questionnaireId: config.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.session) {
        setSession(data.session);
        setResponses(data.session.responses || {});
        localStorage.setItem(`sessionId_${config.id}`, data.session.sessionId);

        if (data.session.status === 'SUBMITTED') {
          setScreen('COMPLETED');
        } else {
          const sIdx = config.sections.findIndex((s) => s.id === data.session.currentSectionId);
          if (sIdx >= 0) {
            setCurrentSectionIdx(sIdx);
            const qIdx = config.sections[sIdx].questions.findIndex((q) => q.id === data.session.currentQuestionId);
            setCurrentQuestionIdx(qIdx >= 0 ? qIdx : 0);
          }
          setScreen('QUESTIONS');
        }
        setResumeModalOpen(false);
      } else {
        setScreen('INTAKE');
      }
    } catch (e) {
      setScreen('INTAKE');
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
            questionNumber: q.number,
            questionText: q.text,
            value,
            otherText,
            currentQuestionId: q.id,
            currentSectionId: currentSection.id,
          }),
        });
        if (res.ok) {
          setAutosaveStatus('saved');
        } else {
          setAutosaveStatus('error');
        }
      } catch (err) {
        setAutosaveStatus('error');
      }
    }, 400);
  };

  const handleNextQuestion = () => {
    setValidationError('');
    if (!currentQuestion) return;

    const currentAns = responses[currentQuestion.id]?.value;
    const isAnswered = currentAns !== undefined && (Array.isArray(currentAns) ? currentAns.length > 0 : currentAns !== '');

    if (currentQuestion.required && isQuestionVisible(currentQuestion) && !isAnswered) {
      setValidationError('Please select or specify an answer before proceeding.');
      return;
    }

    let nextQIdx = currentQuestionIdx + 1;
    let nextSIdx = currentSectionIdx;

    while (nextSIdx < config.sections.length) {
      const sec = config.sections[nextSIdx];
      while (nextQIdx < sec.questions.length) {
        const candQ = sec.questions[nextQIdx];
        if (isQuestionVisible(candQ)) {
          setCurrentSectionIdx(nextSIdx);
          setCurrentQuestionIdx(nextQIdx);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        nextQIdx++;
      }
      nextSIdx++;
      nextQIdx = 0;
    }

    setScreen('REVIEW');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousQuestion = () => {
    setValidationError('');
    let prevQIdx = currentQuestionIdx - 1;
    let prevSIdx = currentSectionIdx;

    while (prevSIdx >= 0) {
      const sec = config.sections[prevSIdx];
      while (prevQIdx >= 0) {
        const candQ = sec.questions[prevQIdx];
        if (isQuestionVisible(candQ)) {
          setCurrentSectionIdx(prevSIdx);
          setCurrentQuestionIdx(prevQIdx);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        prevQIdx--;
      }
      prevSIdx--;
      if (prevSIdx >= 0) {
        prevQIdx = config.sections[prevSIdx].questions.length - 1;
      }
    }
  };

  const handleEditFromReview = (secIdx: number, qIdx: number) => {
    setCurrentSectionIdx(secIdx);
    setCurrentQuestionIdx(qIdx);
    setScreen('QUESTIONS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    if (!session) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`${apiPrefix}/sessions/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          questionnaireId: config.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSession((prev) => (prev ? { ...prev, status: 'SUBMITTED', submittedAt: data.submittedAt } : null));
        setScreen('COMPLETED');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(data.error || 'Submission failed. Please check connection and retry.');
      }
    } catch (e) {
      alert('Error connecting to server during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!session || !session.respondent) {
      alert('Session data is required to compile report.');
      return;
    }
    setIsGeneratingPdf(true);
    try {
      const doc = generatePdfReport(
        config,
        session.respondent,
        responses,
        session.sessionId,
        session.submittedAt || new Date().toISOString()
      );
      doc.save(`Research_Report_${config.id}_${session.sessionId.slice(0, 8)}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Error generating PDF report. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const overallStats = useMemo(() => {
    let total = 0;
    let answered = 0;
    config.sections.forEach((s) => {
      s.questions.forEach((q) => {
        if (!isQuestionVisible(q)) return;
        total++;
        if (responses[q.id]?.value !== undefined && responses[q.id]?.value !== '') {
          answered++;
        }
      });
    });
    return { total, answered };
  }, [config, responses]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fafbfc]">
      <div>
        <Header
          title={config.title}
          targetGroup={config.targetGroup}
          autosaveStatus={autosaveStatus}
          sessionId={session?.sessionId}
          onOpenResume={() => setResumeModalOpen(true)}
          onRetrySave={() => {
            if (currentQuestion) {
              triggerAutosave(currentQuestion, responses[currentQuestion.id]?.value);
            }
          }}
        />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 w-full">
          {screen === 'TOKEN' && (
            <TokenScreen
              questionnaireId={config.id}
              targetGroup={config.targetGroup}
              onTokenSubmitted={validateAndSetToken}
              isValidating={isValidatingToken}
              errorMessage={tokenError}
              demoToken={defaultToken}
            />
          )}

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
              sessionId={session.sessionId}
              submissionTimestamp={session.submittedAt || new Date().toISOString()}
              respondentName={session.respondent?.fullName || 'Participant'}
              onDownloadPdf={handleDownloadPdf}
              isGeneratingPdf={isGeneratingPdf}
            />
          )}
        </main>
      </div>

      <footer className="border-t border-gray-100 py-4 text-center text-[11px] text-gray-400 font-ubuntu">
        Academic Research Questionnaire Platform · India Business Incubator Study
      </footer>

      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        onResume={(sId, code) => restoreSession(sId, code)}
      />
    </div>
  );
}
