'use client';

import React from 'react';
import { QuestionnaireConfig, ResponseValue } from '../lib/types';
import { CheckCircle, Edit3, ArrowLeft, Send } from 'lucide-react';

interface ReviewScreenProps {
  config: QuestionnaireConfig;
  responses: Record<string, ResponseValue>;
  onEditQuestion: (sectionIdx: number, questionIdx: number) => void;
  onConfirmSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function ReviewScreen({
  config,
  responses,
  onEditQuestion,
  onConfirmSubmit,
  onBack,
  isSubmitting = false,
}: ReviewScreenProps) {
  let totalEligible = 0;
  let answered = 0;

  config.sections.forEach((sec) => {
    sec.questions.forEach((q) => {
      if (q.conditional) {
        const parentAns = responses[q.conditional.questionId]?.value;
        if (parentAns !== q.conditional.equals) return;
      }
      totalEligible++;
      if (responses[q.id]?.value !== undefined && responses[q.id]?.value !== '') {
        answered++;
      }
    });
  });

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-horizon-600 font-ubuntu">
            Step 3 of 3 · Final Verification
          </span>
          <h2 className="text-2xl font-bold font-ubuntu text-gray-900 mt-1">
            Review Your Answers
          </h2>
          <p className="text-sm text-gray-500 font-ubuntu mt-1">
            Please review your responses before final submission. You can click 'Edit' on any item to update it.
          </p>
        </div>
      </div>

      <div className="bg-celadon-light border border-celadon-dark/20 rounded-xl p-4 mb-8 flex items-center justify-between text-xs sm:text-sm font-ubuntu">
        <div className="flex items-center space-x-2 text-celadon-dark font-medium">
          <CheckCircle className="w-5 h-5 text-celadon-dark" />
          <span>All required questions completed</span>
        </div>
        <div className="text-gray-700 font-bold">
          {answered} of {totalEligible} answered (100%)
        </div>
      </div>

      <div className="space-y-8">
        {config.sections.map((sec, secIdx) => (
          <div key={sec.id} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold font-ubuntu uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-3 mb-4">
              {sec.title}
            </h3>

            <div className="divide-y divide-gray-100">
              {sec.questions.map((q, qIdx) => {
                let notApplicable = false;
                if (q.conditional) {
                  const parentAns = responses[q.conditional.questionId]?.value;
                  if (parentAns !== q.conditional.equals) {
                    notApplicable = true;
                  }
                }

                const res = responses[q.id];
                let displayVal = 'Not answered';
                if (notApplicable) {
                  displayVal = 'Not applicable (Incubation condition)';
                } else if (res && res.value !== undefined) {
                  if (Array.isArray(res.value)) {
                    displayVal = res.value.join(', ');
                  } else {
                    displayVal = String(res.value);
                  }
                  if (res.otherText) {
                    displayVal += ` (Other: ${res.otherText})`;
                  }
                }

                return (
                  <div key={q.id} className="py-3 flex items-start justify-between text-xs sm:text-sm font-ubuntu">
                    <div className="pr-4 flex-1">
                      <div className="font-medium text-gray-900 mb-0.5">
                        <span className="font-mono text-gray-500 mr-1.5">{q.number}.</span>
                        {q.text}
                      </div>
                      <div className={`mt-1 font-semibold ${notApplicable ? 'text-gray-400 italic' : 'text-horizon-700'}`}>
                        {displayVal}
                      </div>
                    </div>

                    {!notApplicable && (
                      <button
                        type="button"
                        onClick={() => onEditQuestion(secIdx, qIdx)}
                        className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-horizon-600 px-2 py-1 rounded hover:bg-gray-50 transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 font-ubuntu text-sm font-medium transition flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Questions</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onConfirmSubmit}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-horizon-500 hover:bg-horizon-600 text-white font-ubuntu font-bold text-sm transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Submitting Responses...' : 'Confirm & Submit Questionnaire'}</span>
        </button>
      </div>
    </div>
  );
}
