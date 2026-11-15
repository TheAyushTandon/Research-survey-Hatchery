import { QuestionnaireRunner } from '@/components/QuestionnaireRunner';
import { staffQuestionnaire } from '@/config/staff';
import { createInvitationToken } from '@/lib/auth';

export default function StaffPage() {
  const demoToken = createInvitationToken('institutional-staff', 'staff', 60);
  return <QuestionnaireRunner config={staffQuestionnaire} defaultToken={demoToken} />;
}
