import { QuestionnaireRunner } from '@/components/QuestionnaireRunner';
import { governmentQuestionnaire } from '@/config/questionnaire';
import { createInvitationToken } from '@/lib/auth';

export default function GovernmentPage() {
  const demoToken = createInvitationToken('government', 'government', 60);
  return <QuestionnaireRunner config={governmentQuestionnaire} defaultToken={demoToken} />;
}
