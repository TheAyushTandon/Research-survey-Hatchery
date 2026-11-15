import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { verifyInvitationToken } from '@/lib/auth';
import { sheetsStorage } from '@/lib/sheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, questionnaireId, respondentGroup, respondent } = body;

    const tokenCheck = verifyInvitationToken(token, questionnaireId);
    if (!tokenCheck.valid) {
      return NextResponse.json({ error: tokenCheck.error || 'Unauthorized' }, { status: 401 });
    }

    const sessionId = uuidv4();
    const respondentId = uuidv4();
    const resumeToken = uuidv4().replace(/-/g, '').slice(0, 12);
    const now = new Date().toISOString();

    const sessionData = {
      sessionId,
      respondentId,
      questionnaireId,
      respondentGroup,
      status: 'IN_PROGRESS',
      currentSectionId: 'sec_a',
      currentQuestionId: '',
      startedAt: now,
      lastUpdatedAt: now,
      resumeToken,
      respondent: respondent || { isAnonymous: true, consentGiven: true, consentTimestamp: now },
      responses: {},
    };

    const spreadsheetId = getSpreadsheetId(questionnaireId);
    await sheetsStorage.upsertSession(spreadsheetId, sessionData);
    await sheetsStorage.saveRespondent(spreadsheetId, sessionData.respondent, sessionId);
    await sheetsStorage.logEvent(spreadsheetId, sessionId, 'SESSION_CREATED', 'SUCCESS');

    return NextResponse.json({ session: sessionData });
  } catch (e: any) {
    console.error('Session creation error:', e);
    return NextResponse.json({ error: 'Failed to initialize session' }, { status: 500 });
  }
}

function getSpreadsheetId(qId: string) {
  if (qId === 'founders') return process.env.FOUNDERS_SPREADSHEET_ID;
  if (qId === 'institutional-staff') return process.env.INSTITUTIONAL_STAFF_SPREADSHEET_ID;
  if (qId === 'institutional-faculty') return process.env.INSTITUTIONAL_FACULTY_SPREADSHEET_ID;
  if (qId === 'government') return process.env.GOVERNMENT_SPREADSHEET_ID;
  return process.env.SPREADSHEET_ID;
}
