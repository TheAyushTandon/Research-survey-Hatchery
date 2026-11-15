import { QuestionnaireRunner } from '@/components/QuestionnaireRunner';
import { institutionalQuestionnaire } from '@/config/questionnaire';
import { createInvitationToken } from '@/lib/auth';

export default function InstitutionalPage() {
  const demoToken = createInvitationToken('institutional', 'institutional', 60);
  return <QuestionnaireRunner config={institutionalQuestionnaire} defaultToken={demoToken} />;
}
