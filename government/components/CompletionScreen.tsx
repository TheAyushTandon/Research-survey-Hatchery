'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface CompletionScreenProps {
  submissionTimestamp: string;
  onDownloadPdf?: () => void;
  isGeneratingPdf?: boolean;
}

export function CompletionScreen({
  submissionTimestamp,
}: CompletionScreenProps) {
  return (
    <div className="w-full max-w-xl mx-auto py-12 px-4 sm:px-6 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-celadon-light border-2 border-celadon-dark/40 flex items-center justify-center text-celadon-dark mx-auto mb-6 shadow-sm">
        <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold font-ubuntu tracking-tight text-gray-900 mb-3">
        Submission Confirmed
      </h2>
      <p className="text-sm sm:text-base text-gray-600 font-ubuntu mb-8 leading-relaxed max-w-md mx-auto">
        Thank you for your valuable contribution. Your responses have been anonymously and securely recorded in the academic research database.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-left shadow-xs">
        <div className="flex items-center justify-between text-xs text-gray-500 font-ubuntu">
          <span>Submission Time:</span>
          <span className="font-medium text-gray-700">
            {new Date(submissionTimestamp).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
