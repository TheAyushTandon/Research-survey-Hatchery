import { NextRequest, NextResponse } from 'next/server';
import { sheetsStorage } from '@/lib/sheets';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, questionnaireId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ session: null, error: 'No session ID provided' }, { status: 200 });
    }

    const session = sheetsStorage.getSession(sessionId);
    if (!session) {
      return NextResponse.json({ session: null, error: 'Session not found' }, { status: 200 });
    }

    if (questionnaireId && session.questionnaireId !== questionnaireId) {
      return NextResponse.json(
        { session: null, error: `This session belongs to '${session.questionnaireId}', not this questionnaire.` },
        { status: 200 }
      );
    }

    const responses = sheetsStorage.getResponsesForSession(sessionId);
    session.responses = responses;

    return NextResponse.json({ session });
  } catch (err: any) {
    return NextResponse.json({ session: null, error: 'Failed to process resume' }, { status: 200 });
  }
}
