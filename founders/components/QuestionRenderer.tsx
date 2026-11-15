'use client';

import React from 'react';
import { Question, ResponseValue } from '../lib/types';
import { Check, Info } from 'lucide-react';

interface QuestionRendererProps {
  question: Question;
  response?: ResponseValue;
  onChange: (value: string | string[], otherText?: string) => void;
}

export function QuestionRenderer({
  question,
  response,
  onChange,
}: QuestionRendererProps) {
  const currentValue = response?.value;
  const currentOther = response?.otherText || '';

  const isSelected = (opt: string) => {
    if (Array.isArray(currentValue)) {
      return currentValue.includes(opt);
    }
    return currentValue === opt;
  };

  const handleSingleSelect = (opt: string) => {
    if (isSelected(opt)) return;
    const isOther = opt.toLowerCase().includes('other');
    onChange(opt, isOther ? currentOther : undefined);
  };

  const handleMultiSelect = (opt: string) => {
    let arr = Array.isArray(currentValue) ? [...currentValue] : (currentValue ? [String(currentValue)] : []);
    const isNoneOrNo = opt.toLowerCase().includes('none of the above') || opt.toLowerCase().includes('no ip support');

    if (arr.includes(opt)) {
      arr = arr.filter((item) => item !== opt);
      const hasOtherStill = arr.some((item) => item.toLowerCase().includes('other'));
      onChange(arr, hasOtherStill ? currentOther : undefined);
    } else {
      if (isNoneOrNo) {
        onChange([opt], undefined);
        return;
      }

      arr = arr.filter((item) => !item.toLowerCase().includes('none of the above') && !item.toLowerCase().includes('no ip support'));

      if (question.maxSelections && arr.length >= question.maxSelections) {
        return;
      }

      arr.push(opt);
      const isOther = opt.toLowerCase().includes('other');
      onChange(arr, isOther ? currentOther : undefined);
    }
  };

  const handleOtherChange = (text: string) => {
    onChange(currentValue || (question.type.includes('multi') ? ['Other'] : 'Other'), text);
  };

  const otherSelected = Array.isArray(currentValue)
    ? currentValue.some((o) => o.toLowerCase().includes('other'))
    : (typeof currentValue === 'string' && currentValue.toLowerCase().includes('other'));

  const isMulti = question.type === 'multi_select' || question.type === 'limited_multi_select';
  const isLikert = question.type === 'likert_4' || question.type === 'likert_5';

  return (
    <div className="w-full">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono bg-gray-100 text-gray-700">
            {question.number}
          </span>
          {question.conditional && (
            <span className="inline-flex items-center text-[11px] font-medium text-horizon-600 bg-horizon-50 px-2 py-0.5 rounded border border-horizon-200/50">
              Conditional Question
            </span>
          )}
          {question.type === 'limited_multi_select' && (
            <span className="inline-flex items-center text-[11px] font-medium text-peach-dark bg-peach-light px-2 py-0.5 rounded">
              Select up to {question.maxSelections}
            </span>
          )}
          {isMulti && question.type !== 'limited_multi_select' && (
            <span className="inline-flex items-center text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
              Select all that apply
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-ubuntu tracking-tight text-gray-900 leading-snug">
          {question.text}
        </h3>

        {question.maxSelections && (
          <div className="mt-2 text-xs text-gray-500 font-ubuntu flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-gray-400" />
            <span>
              {Array.isArray(currentValue) ? currentValue.length : 0} of {question.maxSelections} selected
            </span>
          </div>
        )}
      </div>

      {/* Answer Options */}
      {isLikert ? (
        <div className="space-y-2">
          <div className={`grid grid-cols-1 sm:grid-cols-${question.options.length} gap-2.5 sm:gap-2`}>
            {question.options.map((opt, idx) => {
              const selected = isSelected(opt);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSingleSelect(opt)}
                  className={`w-full py-3.5 px-3 rounded-xl border text-center transition-all font-ubuntu cursor-pointer flex flex-col items-center justify-center min-h-[58px] ${
                    selected
                      ? 'bg-horizon-400 text-white border-horizon-400 shadow-sm font-semibold'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200/80 hover:border-gray-300 font-medium'
                  }`}
                >
                  <span className="text-xs sm:text-sm leading-tight">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {question.options.map((opt, idx) => {
            const selected = isSelected(opt);
            const isLimitReached =
              isMulti &&
              question.maxSelections &&
              Array.isArray(currentValue) &&
              currentValue.length >= question.maxSelections &&
              !selected;

            return (
              <button
                key={idx}
                type="button"
                disabled={isLimitReached}
                onClick={() => (isMulti ? handleMultiSelect(opt) : handleSingleSelect(opt))}
                className={`w-full text-left py-3.5 px-4 rounded-xl border transition-all font-ubuntu flex items-center justify-between group ${
                  selected
                    ? 'bg-horizon-50/70 border-horizon-400 ring-1 ring-horizon-400/30'
                    : isLimitReached
                    ? 'opacity-40 bg-gray-50 border-gray-100 cursor-not-allowed'
                    : 'bg-white hover:bg-gray-50/80 border-gray-200/80 hover:border-gray-300 cursor-pointer shadow-xs'
                }`}
              >
                <div className="flex items-center space-x-3 pr-2">
                  <div
                    className={`w-4 h-4 rounded-${isMulti ? 'md' : 'full'} border flex items-center justify-center flex-shrink-0 transition-colors ${
                      selected
                        ? 'bg-horizon-400 border-horizon-400 text-white'
                        : 'border-gray-300 bg-white group-hover:border-gray-400'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-sm ${
                      selected ? 'font-semibold text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {opt}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Other / Specify Text Input */}
      {question.hasOther && otherSelected && (
        <div className="mt-4 pt-3 border-t border-gray-100 animate-fadeIn">
          <label className="block text-xs font-semibold text-gray-700 font-ubuntu mb-1.5">
            Please specify details:
          </label>
          <input
            type="text"
            value={currentOther}
            onChange={(e) => handleOtherChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 font-ubuntu focus:outline-none focus:ring-2 focus:ring-horizon-100 focus:border-horizon-400 transition"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
