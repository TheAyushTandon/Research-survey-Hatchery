'use client';

import React, { useState } from 'react';
import { KeyRound, ArrowRight, Sparkles } from 'lucide-react';

interface TokenScreenProps {
  questionnaireId: string;
  targetGroup: string;
  onTokenSubmitted: (token: string) => void;
  isValidating?: boolean;
  errorMessage?: string;
  demoToken?: string;
}

export function TokenScreen({
  questionnaireId,
  targetGroup,
  onTokenSubmitted,
  isValidating = false,
  errorMessage,
  demoToken,
}: TokenScreenProps) {
  const [tokenInput, setTokenInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      onTokenSubmitted(tokenInput.trim());
    }
  };

  const handleUseDemo = () => {
    if (demoToken) {
      setTokenInput(demoToken);
      onTokenSubmitted(demoToken);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-horizon-50 border border-horizon-200/80 flex items-center justify-center text-horizon-600 mb-5">
          <KeyRound className="w-6 h-6" />
        </div>

        <div className="mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-horizon-600 font-ubuntu">
            Research Access Control
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-ubuntu text-gray-900 mt-1">
            Participant Access Required
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-ubuntu mt-2 leading-relaxed">
            This digital questionnaire is reserved for authorized participants in the{' '}
            <strong className="text-gray-800">{targetGroup}</strong> research cohort. Please enter your signed invitation token below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 font-ubuntu mb-1.5">
              Invitation Token / Access Key
            </label>
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste token (e.g. eyJxdWVzdGlv...)"
              className="w-full px-3.5 py-2.5 text-xs font-mono rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-horizon-100 focus:border-horizon-400 transition"
              autoFocus
            />
          </div>

          {errorMessage && (
            <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg font-ubuntu border border-red-100">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isValidating || !tokenInput.trim()}
            className="w-full py-3 rounded-xl bg-horizon-400 hover:bg-horizon-500 text-white font-ubuntu font-bold text-sm transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{isValidating ? 'Validating Token...' : 'Enter Questionnaire'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {demoToken && (
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-ubuntu mb-2">
              Reviewer / Academic Evaluator Shortcut:
            </p>
            <button
              type="button"
              onClick={handleUseDemo}
              className="inline-flex items-center text-xs font-ubuntu font-medium text-horizon-600 hover:text-horizon-700 bg-horizon-50 hover:bg-horizon-100 px-3 py-1.5 rounded-lg border border-horizon-200/50 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Click here to load authorized {targetGroup} demo token
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
