'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, RefreshCw, AlertCircle, Bookmark } from 'lucide-react';

interface HeaderProps {
  title: string;
  targetGroup: string;
  autosaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  sessionId?: string;
  onOpenResume?: () => void;
  onRetrySave?: () => void;
}

export function Header({
  title,
  targetGroup,
  autosaveStatus,
  sessionId,
  onOpenResume,
  onRetrySave,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Research Title & Badge */}
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-horizon-50 border border-horizon-200 flex items-center justify-center text-horizon-600 flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs tracking-wider uppercase text-gray-500 font-ubuntu">
                Academic Research
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-horizon-100/70 text-horizon-700">
                {targetGroup}
              </span>
            </div>
            <h1 className="text-xs text-gray-400 truncate max-w-xs sm:max-w-md font-ubuntu">
              {title}
            </h1>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Autosave Pill */}
          {sessionId && (
            <div className="flex items-center text-xs text-gray-500 font-ubuntu">
              {autosaveStatus === 'saving' && (
                <span className="inline-flex items-center text-gray-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5 text-horizon-500" />
                  <span className="hidden sm:inline">Saving...</span>
                </span>
              )}
              {autosaveStatus === 'saved' && (
                <span className="inline-flex items-center text-celadon-dark font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-celadon-dark" />
                  <span className="hidden sm:inline">Saved</span>
                </span>
              )}
              {autosaveStatus === 'error' && (
                <button
                  onClick={onRetrySave}
                  className="inline-flex items-center text-red-600 hover:text-red-700 bg-red-50 px-2 py-1 rounded transition cursor-pointer"
                  title="Click to retry saving"
                >
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  <span className="underline">Retry</span>
                </button>
              )}
            </div>
          )}

          {/* Session Tag */}
          {sessionId && (
            <div className="hidden md:flex items-center text-[11px] font-mono bg-gray-50 text-gray-500 px-2.5 py-1 rounded border border-gray-200/60" title={`Active Session ID: ${sessionId}`}>
              #{sessionId.slice(0, 8)}...
            </div>
          )}

          {/* Resume Session Button */}
          {onOpenResume && (
            <button
              onClick={onOpenResume}
              type="button"
              className="text-xs font-ubuntu font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-2.5 py-1.5 rounded-md transition flex items-center shadow-xs cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 mr-1 text-gray-400" />
              Resume
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
