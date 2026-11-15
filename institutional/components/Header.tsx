'use client';

import React from 'react';

interface HeaderProps {
  title?: string;
  targetGroup?: string;
  autosaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  sessionId?: string;
  onOpenResume?: () => void;
  onRetrySave?: () => void;
}

export function Header({
  autosaveStatus,
  sessionId,
  onOpenResume,
  onRetrySave,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-30">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Solid heading only - no icons */}
        <span className="text-sm font-semibold tracking-wide text-gray-900 font-ubuntu">
          Academic Research
        </span>

        {/* Minimal status & resume action */}
        <div className="flex items-center space-x-3 text-xs font-ubuntu">
          {sessionId && (
            <div>
              {autosaveStatus === 'saving' && (
                <span className="text-gray-400 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-horizon-400 animate-pulse mr-1.5" />
                  Saving...
                </span>
              )}
              {autosaveStatus === 'saved' && (
                <span className="text-emerald-600 font-medium flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                  Saved
                </span>
              )}
              {autosaveStatus === 'error' && (
                <button
                  onClick={onRetrySave}
                  className="text-red-500 hover:text-red-600 underline cursor-pointer"
                >
                  Retry save
                </button>
              )}
            </div>
          )}

          {onOpenResume && (
            <button
              onClick={onOpenResume}
              type="button"
              className="text-gray-400 hover:text-gray-700 text-xs transition cursor-pointer"
            >
              Resume
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
