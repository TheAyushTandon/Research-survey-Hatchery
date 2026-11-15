import { NextRequest, NextResponse } from 'next/server';
import { sheetsStorage } from '@/lib/sheets';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, questionnaireId, finalResponses } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = sheetsStorage.getSession(sessionId);
    if (session && session.status === 'SUBMITTED') {
      return NextResponse.json({ success: true, submittedAt: session.submittedAt, session });
    }

    const submittedAt = new Date().toISOString();
    if (session) {
      session.status = 'SUBMITTED';
      session.submittedAt = submittedAt;
    }

    const allResponses = finalResponses || (session ? sheetsStorage.getResponsesForSession(sessionId) : {});

    // 1. Google Apps Script Web App Webhook (Simplest & Direct)
    const webappUrl =
      process.env.GOOGLE_SHEET_WEBAPP_URL ||
      process.env.GOOGLE_APPS_SCRIPT_URL ||
      process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (webappUrl) {
      try {
        await fetch(webappUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          redirect: 'follow',
          body: JSON.stringify({
            event: 'SUBMIT_FORM',
            sessionId,
            questionnaireId,
            submittedAt,
            responses: allResponses,
          }),
        });
      } catch (err) {
        console.error('Failed to post to Google Apps Script Web App:', err);
      }
    }

    // 2. Google Sheets API (Service Account Fallback)
    const spreadsheetId = getSpreadsheetId(questionnaireId);
    if (spreadsheetId) {
      await sheetsStorage.upsertSession(spreadsheetId, {
        ...(session || { sessionId, questionnaireId }),
        status: 'SUBMITTED',
        submittedAt,
      });
      await sheetsStorage.logEvent(spreadsheetId, sessionId, 'SUBMISSION_CONFIRMED', 'SUCCESS');
    }

    const updatedSession = session
      ? { ...session, status: 'SUBMITTED' as const, submittedAt }
      : {
          sessionId,
          questionnaireId,
          status: 'SUBMITTED' as const,
          submittedAt,
          startedAt: submittedAt,
          lastUpdatedAt: submittedAt,
          responses: allResponses,
        };

    return NextResponse.json({ success: true, submittedAt, session: updatedSession });
  } catch (e: any) {
    console.error('Submission error:', e);
    return NextResponse.json({ error: 'Failed to record submission' }, { status: 500 });
  }
}

function getSpreadsheetId(qId: string) {
  if (qId === 'founders') return process.env.FOUNDERS_SPREADSHEET_ID;
  if (qId === 'institutional') return process.env.INSTITUTIONAL_SPREADSHEET_ID || process.env.SPREADSHEET_ID;
  if (qId === 'institutional-staff') return process.env.INSTITUTIONAL_STAFF_SPREADSHEET_ID;
  if (qId === 'institutional-faculty') return process.env.INSTITUTIONAL_FACULTY_SPREADSHEET_ID;
  if (qId === 'government') return process.env.GOVERNMENT_SPREADSHEET_ID;
  return process.env.SPREADSHEET_ID;
}
