import React from 'react';
import Link from 'next/link';
import { QuestionnaireRunner } from '@/components/QuestionnaireRunner';
import { staffQuestionnaire } from '@/config/staff';
import { createInvitationToken } from '@/lib/auth';

export default function StaffPage() {
  const demoToken = createInvitationToken('institutional-staff', 'staff', 60);
  return (
    <div>
      <div className="bg-[#f8fafc] border-b border-gray-100 py-2 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between text-xs text-gray-500 font-ubuntu">
          <span>Track: <strong>Group A (Incubator Heads & Operational Staff)</strong></span>
          <Link href="/" className="text-horizon-600 hover:underline font-medium">
            ← Change Track
          </Link>
        </div>
      </div>
      <QuestionnaireRunner config={staffQuestionnaire} defaultToken={demoToken} />
    </div>
  );
}
