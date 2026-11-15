'use client';

import React, { useState } from 'react';
import { CheckCircle2, Download, Copy, Check } from 'lucide-react';

interface CompletionScreenProps {
  sessionId: string;
  submissionTimestamp: string;
  respondentName: string;
  onDownloadPdf: () => void;
  isGeneratingPdf?: boolean;
}

export function CompletionScreen({
  sessionId,
  submissionTimestamp,
  respondentName,
  onDownloadPdf,
  isGeneratingPdf = false,
}: CompletionScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-4 sm:px-6 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-celadon-light border-2 border-celadon-dark/40 flex items-center justify-center text-celadon-dark mx-auto mb-6 shadow-sm">
        <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold font-ubuntu tracking-tight text-gray-900 mb-3">
        Submission Confirmed
      </h2>
      <p className="text-sm sm:text-base text-gray-600 font-ubuntu mb-8 leading-relaxed max-w-md mx-auto">
        Thank you, <span className="font-semibold text-gray-900">{respondentName}</span>. Your responses have been securely verified and saved to the academic research archive.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-left shadow-xs mb-8 space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-ubuntu">
            Official Research Session ID
          </span>
          <div className="mt-1 flex items-center justify-between bg-gray-50 border border-gray-200/60 rounded-xl px-3.5 py-2.5">
            <span className="font-mono text-xs sm:text-sm text-gray-800 break-all select-all">
              {sessionId}
            </span>
            <button
              onClick={handleCopy}
              type="button"
              className="ml-2 inline-flex items-center text-xs font-medium text-horizon-600 hover:text-horizon-700 bg-white border border-gray-200 px-2.5 py-1.5 rounded-md transition shadow-2xs cursor-pointer"
              title="Copy Session ID"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-green-600" />
                  <span className="text-green-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 font-ubuntu pt-2 border-t border-gray-100">
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
          A copy of your complete questionnaire response report will be saved to your device in PDF format.
        </p>
      </div>
    </div>
  );
}
