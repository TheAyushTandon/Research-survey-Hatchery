'use client';

import React, { useState } from 'react';
import { RespondentInfo } from '../lib/types';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface IntakeScreenProps {
  title: string;
  targetGroup: string;
  description: string;
  instructions: string[];
  confidentialityNotice: string;
  consentStatement: string;
  onSubmit: (info: RespondentInfo) => void;
  isLoading?: boolean;
}

export function IntakeScreen({
  title,
  targetGroup,
  description,
  instructions,
  confidentialityNotice,
  consentStatement,
  onSubmit,
  isLoading = false,
}: IntakeScreenProps) {
  const [consentGiven, setConsentGiven] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      setError('Please acknowledge participation consent to proceed.');
      return;
    }
    setError('');
    onSubmit({
      isAnonymous: true,
      consentGiven: true,
      consentTimestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Title & Research Cohort */}
      <div className="mb-8">
        <div className="inline-block text-xs font-semibold uppercase tracking-wider text-horizon-600 font-ubuntu mb-2">
          {targetGroup}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-ubuntu tracking-tight text-gray-900 leading-snug">
          {title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-600 font-ubuntu leading-relaxed">
          {description}
        </p>
      </div>

      {/* Anonymity Guarantee Notice (Warm Lemon Chiffon surface) */}
      <div className="mb-8 rounded-xl bg-chiffon-light/90 border border-chiffon-dark/30 p-5 font-ubuntu text-gray-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center">
          <ShieldCheck className="w-4 h-4 mr-1.5 text-gray-700" />
          100% Anonymous Academic Research
        </h3>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">
          {confidentialityNotice}
        </p>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside border-t border-chiffon-dark/20 pt-2.5">
          {instructions.map((inst, i) => (
            <li key={i}>{inst}</li>
          ))}
        </ul>
      </div>

      {/* Onboarding & Consent Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <label className="flex items-start space-x-3 cursor-pointer group">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="w-4 h-4 text-horizon-600 rounded border-gray-300 focus:ring-horizon-400 focus:ring-offset-0 transition cursor-pointer"
              />
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-ubuntu leading-relaxed select-none group-hover:text-gray-900">
              {consentStatement}
            </div>
          </label>
          {error && <p className="mt-2 text-xs text-red-500 font-ubuntu">{error}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-horizon-400 hover:bg-horizon-500 text-white font-ubuntu font-bold text-sm transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
          >
            <span>{isLoading ? 'Starting Questionnaire...' : 'Begin Questionnaire'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
