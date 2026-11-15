'use client';

import React, { useState } from 'react';
import { X, ArrowRight, Bookmark } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResume: (sessionId: string, resumeCode: string) => void;
  isLoading?: boolean;
}

export function ResumeModal({
  isOpen,
  onClose,
  onResume,
  isLoading = false,
}: ResumeModalProps) {
  const [sessionId, setSessionId] = useState('');
  const [resumeCode, setResumeCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId.trim()) {
      setError('Please enter your Session ID or Resume Code.');
      return;
    }
    setError('');
    onResume(sessionId.trim(), resumeCode.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center space-x-2 text-gray-800 font-ubuntu">
            <Bookmark className="w-4 h-4 text-horizon-500" />
            <h3 className="font-bold text-base">Resume Previous Session</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-600 font-ubuntu mb-4 leading-relaxed">
          If you previously started this questionnaire, enter your Session ID below to restore all your saved responses and continue where you left off.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 font-ubuntu mb-1">
              Session ID
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="e.g. 8f9b1c2d-3e4f-..."
              className="w-full px-3.5 py-2.5 text-xs font-mono rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-horizon-100 focus:border-horizon-400"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 font-ubuntu mb-1">
              Resume Passcode / Token (Optional)
            </label>
            <input
              type="text"
              value={resumeCode}
              onChange={(e) => setResumeCode(e.target.value)}
              placeholder="Leave empty if not applicable"
              className="w-full px-3.5 py-2.5 text-xs font-mono rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-horizon-100 focus:border-horizon-400"
            />
          </div>

          {error && <p className="text-xs text-red-500 font-ubuntu">{error}</p>}

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium font-ubuntu text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg bg-horizon-400 hover:bg-horizon-500 text-white font-ubuntu text-xs font-bold transition flex items-center space-x-1.5 disabled:opacity-60 cursor-pointer"
            >
              <span>{isLoading ? 'Verifying...' : 'Restore Responses'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
