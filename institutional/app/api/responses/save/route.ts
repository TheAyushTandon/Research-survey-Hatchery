import { NextRequest, NextResponse } from 'next/server';
import { sheetsStorage } from '@/lib/sheets';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { sessionId, questionnaireId, questionId, value } = payload;

    if (!sessionId || !questionId) {
      return NextResponse.json({ error: 'Missing required response parameters' }, { status: 400 });
    }

    const session = sheetsStorage.getSession(sessionId);
    if (session && session.status === 'SUBMITTED') {
      return NextResponse.json({ error: 'Cannot modify a submitted questionnaire' }, { status: 403 });
    }

    const spreadsheetId = getSpreadsheetId(questionnaireId);
    await sheetsStorage.saveResponse(spreadsheetId, payload);

    return NextResponse.json({ success: true, savedAt: new Date().toISOString() });
  } catch (err: any) {
    console.error('Response save error:', err);
    return NextResponse.json({ error: 'Failed to persist response' }, { status: 500 });
  }
}

function getSpreadsheetId(qId: string) {
  if (qId === 'institutional') return process.env.INSTITUTIONAL_SPREADSHEET_ID || process.env.SPREADSHEET_ID;
  if (qId === 'institutional-staff') return process.env.INSTITUTIONAL_STAFF_SPREADSHEET_ID;
  if (qId === 'institutional-faculty') return process.env.INSTITUTIONAL_FACULTY_SPREADSHEET_ID;
  if (qId === 'government') return process.env.GOVERNMENT_SPREADSHEET_ID;
  return process.env.SPREADSHEET_ID;
}
