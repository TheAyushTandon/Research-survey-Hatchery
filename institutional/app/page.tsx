'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import { createInvitationToken } from '@/lib/auth';

export default function InstitutionalGateway() {
  const router = useRouter();
  const [tokenParam, setTokenParam] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('token');
      if (p) {
        setTokenParam(`?token=${p}`);
        try {
          const payload = JSON.parse(atob(p.split('.')[0]));
          if (payload.questionnaireId === 'institutional-staff') {
            router.push(`/staff?token=${p}`);
          } else if (payload.questionnaireId === 'institutional-faculty') {
            router.push(`/faculty?token=${p}`);
          }
        } catch (e) {}
      }
    }
  }, [router]);

  const staffDemoToken = createInvitationToken('institutional-staff', 'staff', 60);
  const facultyDemoToken = createInvitationToken('institutional-faculty', 'faculty', 60);

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col justify-between">
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-horizon-50 border border-horizon-200 flex items-center justify-center text-horizon-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-xs tracking-wider uppercase text-gray-500 font-ubuntu">
              Academic Research Platform
            </span>
            <h1 className="text-xs text-gray-400 font-ubuntu">
              Incubator Leadership & Faculty Investigation
            </h1>
          </div>
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
            href={`/staff${tokenParam || `?token=${staffDemoToken}`}`}
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
            href={`/faculty${tokenParam || `?token=${facultyDemoToken}`}`}
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
