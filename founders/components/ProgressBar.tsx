'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ProgressBarProps {
  sectionTitle: string;
  questionNumber: string;
  currentQuestionIndex: number;
  totalSectionQuestions: number;
  overallAnsweredCount: number;
  overallTotalQuestions: number;
  onPrevious?: () => void;
  canGoPrevious?: boolean;
}

export function ProgressBar({
  sectionTitle,
  questionNumber,
  currentQuestionIndex,
  totalSectionQuestions,
  overallAnsweredCount,
  overallTotalQuestions,
  onPrevious,
  canGoPrevious,
}: ProgressBarProps) {
  const percent = overallTotalQuestions > 0 ? Math.round((overallAnsweredCount / overallTotalQuestions) * 100) : 0;

  return (
    <div className="w-full pt-4 pb-2">
      <div className="flex items-center justify-between text-xs text-gray-500 font-ubuntu mb-2">
        <div className="flex items-center space-x-2">
          {canGoPrevious && onPrevious && (
            <button
              onClick={onPrevious}
              type="button"
              className="inline-flex items-center text-gray-500 hover:text-gray-900 pr-1 transition cursor-pointer"
              title="Return to previous question"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-0.5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <span className="font-semibold text-gray-800">{sectionTitle}</span>
          <span className="text-gray-300">·</span>
          <span>
            {questionNumber} of {totalSectionQuestions}
          </span>
        </div>
        <div className="text-gray-500 font-medium">
          {overallAnsweredCount} / {overallTotalQuestions} answered ({percent}%)
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-horizon-400 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
