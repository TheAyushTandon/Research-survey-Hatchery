import { NextRequest, NextResponse } from 'next/server';
import { sheetsStorage } from '@/lib/sheets';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, resumeCode, questionnaireId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = sheetsStorage.getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found. Please verify your Session ID.' }, { status: 404 });
    }

    if (questionnaireId && session.questionnaireId !== questionnaireId) {
      return NextResponse.json(
        { error: `This session belongs to '${session.questionnaireId}', not this questionnaire.` },
        { status: 403 }
      );
    }

    const responses = sheetsStorage.getResponsesForSession(sessionId);
    session.responses = responses;

    return NextResponse.json({ session });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to resume session' }, { status: 500 });
  }
}
