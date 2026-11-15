import crypto from 'crypto';

export const DEFAULT_SECRET = process.env.INVITATION_TOKEN_SECRET || 'research_secret_key_2026_academic_incubators';

export interface TokenPayload {
  questionnaireId: string;
  group: string;
  issuedAt: number;
  expiresAt: number;
  nonce?: string;
}

export function createInvitationToken(
  questionnaireId: string,
  group: string,
  daysValid = 30,
  secret = DEFAULT_SECRET
): string {
  const payload: TokenPayload = {
    questionnaireId,
    group,
    issuedAt: Date.now(),
    expiresAt: Date.now() + daysValid * 24 * 60 * 60 * 1000,
    nonce: crypto.randomBytes(8).toString('hex'),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

export function verifyInvitationToken(
  token: string,
  expectedQuestionnaireId?: string,
  secret = DEFAULT_SECRET
): { valid: boolean; payload?: TokenPayload; error?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'No invitation token provided' };
  }

  const parts = token.trim().split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid token structure' };
  }

  const [payloadB64, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');

  if (signature !== expectedSig) {
    return { valid: false, error: 'Invalid invitation signature' };
  }

  try {
    const payload: TokenPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Invitation token has expired' };
    }
    if (expectedQuestionnaireId && payload.questionnaireId !== expectedQuestionnaireId) {
      const isInstitutionalMatch =
        expectedQuestionnaireId === 'institutional' &&
        (payload.questionnaireId === 'institutional-staff' || payload.questionnaireId === 'institutional-faculty');

      if (!isInstitutionalMatch) {
        return {
          valid: false,
          error: `Invitation is valid for '${payload.questionnaireId}', but this endpoint requires '${expectedQuestionnaireId}'.`,
        };
      }
    }
    return { valid: true, payload };
  } catch (e) {
    return { valid: false, error: 'Failed to decode token payload' };
  }
}
