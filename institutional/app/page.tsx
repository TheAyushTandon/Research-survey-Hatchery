import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Building2, GraduationCap, ArrowRight } from 'lucide-react';

interface PageProps {
  searchParams?: { token?: string };
}

export default function InstitutionalGateway({ searchParams }: PageProps) {
  const token = typeof searchParams?.token === 'string' ? searchParams.token : undefined;

  // If a valid token is provided in the query string, direct the respondent straight to their track
  if (token) {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString('utf8'));
      if (payload.questionnaireId === 'institutional-staff') {
        redirect(`/staff?token=${encodeURIComponent(token)}`);
      } else if (payload.questionnaireId === 'institutional-faculty') {
        redirect(`/faculty?token=${encodeURIComponent(token)}`);
      }
    } catch (e) {
      // If token parsing fails, fall through to track selection
    }
  }

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

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-horizon-600 font-ubuntu">
            Stakeholder Track Selection
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-ubuntu tracking-tight text-gray-900 mt-1">
            Choose Your Institutional Role
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-ubuntu max-w-md mx-auto">
            This deployment hosts two distinct academic questionnaires. Please select your verified stakeholder group to proceed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Group A: Incubator Managers & Operational Staff */}
          <Link
            href={staffHref}
            className="group bg-white rounded-2xl border border-gray-200/80 hover:border-horizon-400 p-6 transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-horizon-50 text-horizon-600 flex items-center justify-center mb-4 group-hover:bg-horizon-500 group-hover:text-white transition">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-horizon-600 font-ubuntu">
                Group A · 10 Questions
              </span>
              <h3 className="text-lg font-bold font-ubuntu text-gray-900 mt-1">
                Incubator Managers & Operational Staff
              </h3>
              <p className="text-xs text-gray-500 font-ubuntu mt-2 leading-relaxed">
                Evaluates Lean Startup feedback loops, trilateral networks, and daily incubation workflows.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-horizon-600 font-ubuntu">
              <span>Enter Staff Questionnaire</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Group B: Faculty Members & Leadership */}
          <Link
            href={facultyHref}
            className="group bg-white rounded-2xl border border-gray-200/80 hover:border-horizon-400 p-6 transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-peach-light text-peach-dark flex items-center justify-center mb-4 group-hover:bg-peach-dark group-hover:text-white transition">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-peach-dark font-ubuntu">
                Group B · 10 Questions
              </span>
              <h3 className="text-lg font-bold font-ubuntu text-gray-900 mt-1">
                Faculty Members & University Leadership
              </h3>
              <p className="text-xs text-gray-500 font-ubuntu mt-2 leading-relaxed">
                For Deans, HoDs, VCs, and faculty involved with incubation, technology transfer, and commercialization.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-peach-dark font-ubuntu">
              <span>Enter Faculty Questionnaire</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-4 text-center text-[11px] text-gray-400 font-ubuntu">
        Academic Research Questionnaire Platform · Institutional Deployment
      </footer>
    </div>
  );
}
