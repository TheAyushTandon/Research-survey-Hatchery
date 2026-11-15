import { NextRequest, NextResponse } from 'next/server';
import { verifyInvitationToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { token, expectedQuestionnaireId } = await req.json();
    const result = verifyInvitationToken(token, expectedQuestionnaireId);

    if (!result.valid) {
      return NextResponse.json({ valid: false, error: result.error }, { status: 401 });
    }

    return NextResponse.json({ valid: true, payload: result.payload });
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: 'Failed to process token' }, { status: 500 });
  }
}
