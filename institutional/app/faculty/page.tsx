import { QuestionnaireRunner } from '@/components/QuestionnaireRunner';
import { facultyQuestionnaire } from '@/config/faculty';
import { createInvitationToken } from '@/lib/auth';

export default function FacultyPage() {
  const demoToken = createInvitationToken('institutional-faculty', 'faculty', 60);
  return <QuestionnaireRunner config={facultyQuestionnaire} defaultToken={demoToken} />;
}
