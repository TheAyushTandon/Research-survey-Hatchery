'use client';

import React from 'react';
import { CheckCircle2, Download } from 'lucide-react';

interface CompletionScreenProps {
  submissionTimestamp: string;
  onDownloadPdf: () => void;
  isGeneratingPdf?: boolean;
}

export function CompletionScreen({
  submissionTimestamp,
  onDownloadPdf,
  isGeneratingPdf = false,
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

      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-left shadow-xs mb-8">
        <div className="flex items-center justify-between text-xs text-gray-500 font-ubuntu">
          <span>Submission Time:</span>
          <span className="font-medium text-gray-700">
            {new Date(submissionTimestamp).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-horizon-400 hover:bg-horizon-500 text-white font-ubuntu font-bold text-sm transition shadow-sm inline-flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          <span>{isGeneratingPdf ? 'Generating PDF Document...' : 'Download Official PDF Report'}</span>
        </button>

        <p className="text-xs text-gray-400 font-ubuntu">
          You may download a verified PDF copy of your submitted answers for your records.
        </p>
      </div>
    </div>
  );
}
