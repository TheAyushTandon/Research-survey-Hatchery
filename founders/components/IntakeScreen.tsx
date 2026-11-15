'use client';

import React, { useState } from 'react';
import { RespondentInfo } from '../lib/types';
import { FileText, ArrowRight, ShieldCheck } from 'lucide-react';

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
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!designation.trim()) errs.designation = 'Current Designation is required.';
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[+0-9\s\-()]{7,18}$/.test(phone.trim())) {
      errs.phone = 'Please provide a valid contact phone number.';
    }
    if (!consentGiven) {
      errs.consent = 'Participation consent is required to begin.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      fullName: fullName.trim(),
      designation: designation.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      consentGiven: true,
      consentTimestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-horizon-50 text-horizon-700 text-xs font-medium font-ubuntu mb-3 border border-horizon-200/60">
          <FileText className="w-3.5 h-3.5" />
          <span>Research Intake · {targetGroup}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-ubuntu tracking-tight text-gray-900 leading-snug">
          {title}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-600 font-ubuntu leading-relaxed">
          {description}
        </p>
      </div>

      {/* Instructions & Confidentiality Box (Lemon Chiffon surface) */}
      <div className="mb-8 rounded-xl bg-chiffon-light/90 border border-chiffon-dark/30 p-5 font-ubuntu text-gray-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5 flex items-center">
          <ShieldCheck className="w-4 h-4 mr-1.5 text-gray-700" />
          Instructions & Academic Confidentiality
        </h3>
        <ul className="text-xs sm:text-sm text-gray-700 space-y-1.5 list-disc list-inside mb-3">
          {instructions.map((inst, i) => (
            <li key={i}>{inst}</li>
          ))}
        </ul>
        <p className="text-xs text-gray-600 border-t border-chiffon-dark/20 pt-2.5 italic">
          {confidentialityNotice}
        </p>
      </div>

      {/* Respondent Intake Form */}
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-bold font-ubuntu text-gray-900 border-b border-gray-100 pb-3">
          Respondent Information
        </h3>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-gray-700 font-ubuntu mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Dr. Jane Sharma / Rajesh Kumar"
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg border font-ubuntu transition focus:outline-none focus:ring-2 ${
              errors.fullName
                ? 'border-red-300 focus:ring-red-200'
                : 'border-gray-200 focus:border-horizon-400 focus:ring-horizon-100'
            }`}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
        </div>

        {/* Current Designation */}
        <div>
          <label className="block text-xs font-medium text-gray-700 font-ubuntu mb-1.5">
            Designation / Role <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="e.g. Founder & CEO / Dean / Incubator Manager / Director"
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg border font-ubuntu transition focus:outline-none focus:ring-2 ${
              errors.designation
                ? 'border-red-300 focus:ring-red-200'
                : 'border-gray-200 focus:border-horizon-400 focus:ring-horizon-100'
            }`}
          />
          {errors.designation && <p className="mt-1 text-xs text-red-500">{errors.designation}</p>}
        </div>

        {/* Email & Phone grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 font-ubuntu mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.com"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border font-ubuntu transition focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-200 focus:border-horizon-400 focus:ring-horizon-100'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 font-ubuntu mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border font-ubuntu transition focus:outline-none focus:ring-2 ${
                errors.phone
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-200 focus:border-horizon-400 focus:ring-horizon-100'
              }`}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="pt-2">
          <label className="flex items-start space-x-3 cursor-pointer group">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="w-4 h-4 text-horizon-600 rounded border-gray-300 focus:ring-horizon-400 focus:ring-offset-0 transition cursor-pointer"
              />
            </div>
            <div className="text-xs text-gray-600 font-ubuntu leading-relaxed select-none group-hover:text-gray-900">
              {consentStatement}
            </div>
          </label>
          {errors.consent && <p className="mt-1 text-xs text-red-500">{errors.consent}</p>}
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-horizon-400 hover:bg-horizon-500 text-white font-ubuntu font-medium text-sm transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
          >
            <span>{isLoading ? 'Initializing Session...' : 'Begin Questionnaire'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
