import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PageProps {
  searchParams?: { token?: string };
}

export default function InstitutionalGateway({ searchParams }: PageProps) {
  const token = typeof searchParams?.token === 'string' ? searchParams.token : undefined;
  const staffHref = token ? `/staff?token=${encodeURIComponent(token)}` : '/staff';
  const facultyHref = token ? `/faculty?token=${encodeURIComponent(token)}` : '/faculty';

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col justify-between">
      {/* Minimal Header - Solid text only, no icons */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wide text-gray-900 font-ubuntu">
            Academic Research
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-horizon-600 font-ubuntu">
            Stakeholder Category Selection
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-ubuntu tracking-tight text-gray-900 mt-2">
            Questionnaire for Incubator Managers and Operational Staff / Faculty Members
          </h1>
          <p className="mt-3 text-sm text-gray-500 font-ubuntu max-w-lg mx-auto leading-relaxed">
            Please select your verified stakeholder group below to access your designated 10-question research evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Group A: Incubator Heads, Managers & Operational Staff */}
          <Link
            href={staffHref}
            className="group bg-white rounded-2xl border border-gray-200/90 hover:border-horizon-400 p-6 sm:p-7 transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-horizon-600 font-ubuntu">
                Group A · 10 Questions
              </span>
              <h2 className="text-lg font-bold font-ubuntu text-gray-900 mt-2">
                Incubator Heads, Managers and Operational Staff
              </h2>
              <p className="text-xs text-gray-500 font-ubuntu mt-2.5 leading-relaxed">
                Evaluates Lean Startup feedback loop implementation (Build-Measure-Learn), validated metrics, and trilateral institutional networks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-horizon-600 font-ubuntu">
              <span>Enter Group A Questionnaire</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Group B: Faculty Members & University Leadership */}
          <Link
            href={facultyHref}
            className="group bg-white rounded-2xl border border-gray-200/90 hover:border-horizon-400 p-6 sm:p-7 transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-horizon-600 font-ubuntu">
                Group B · 10 Questions
              </span>
              <h2 className="text-lg font-bold font-ubuntu text-gray-900 mt-2">
                Faculty Members (University Deans, HoDs, and VCs)
              </h2>
              <p className="text-xs text-gray-500 font-ubuntu mt-2.5 leading-relaxed">
                For Deans, HoDs, Vice Chancellors, and faculty members associated with incubation and academic entrepreneurship programmes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-horizon-600 font-ubuntu">
              <span>Enter Group B Questionnaire</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-gray-400 border-t border-gray-100">
        Academic Research Questionnaire Platform · Institutional Study
      </footer>
    </div>
  );
}
