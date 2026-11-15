import { QuestionnaireRunner } from '@/components/QuestionnaireRunner';
import { foundersQuestionnaire } from '@/config/questionnaire';
import { createInvitationToken } from '@/lib/auth';

export default function FoundersPage() {
  const demoToken = createInvitationToken('founders', 'founders', 60);
  return <QuestionnaireRunner config={foundersQuestionnaire} defaultToken={demoToken} />;
}
