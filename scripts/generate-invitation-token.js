const crypto = require('crypto');

const DEFAULT_SECRET = process.env.INVITATION_TOKEN_SECRET || 'research_secret_key_2026_academic_incubators';

function createToken(questionnaireId, group, daysValid = 30, secret = DEFAULT_SECRET) {
  const payload = {
    questionnaireId,
    group,
    issuedAt: Date.now(),
    expiresAt: Date.now() + daysValid * 24 * 60 * 60 * 1000,
    nonce: crypto.randomBytes(8).toString('hex')
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

function verifyToken(token, expectedQuestionnaireId, secret = DEFAULT_SECRET) {
  if (!token || typeof token !== 'string') return { valid: false, error: 'No token provided' };
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false, error: 'Malformed token structure' };

  const [payloadB64, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return { valid: false, error: 'Invalid token signature' };
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Token has expired' };
    }
    if (expectedQuestionnaireId && payload.questionnaireId !== expectedQuestionnaireId) {
      return { valid: false, error: `Token is for '${payload.questionnaireId}', not '${expectedQuestionnaireId}'` };
    }
    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: 'Failed to parse token payload' };
  }
}

// If run from command line
if (require.main === module) {
  const args = process.argv.slice(2);
  const target = args[0] || 'all';

  console.log('=== Academic Research Questionnaire - Invitation Token Generator ===\n');

  const groups = [
    { id: 'founders', group: 'founders', name: 'Startup Founders & Entrepreneurs' },
    { id: 'institutional-staff', group: 'staff', name: 'Incubator Managers & Operational Staff' },
    { id: 'institutional-faculty', group: 'faculty', name: 'Faculty Members (Deans, HoDs, VCs)' },
    { id: 'government', group: 'government', name: 'Government Agencies & Policymakers' }
  ];

  groups.forEach(g => {
    if (target === 'all' || target === g.id || target === g.group) {
      const token = createToken(g.id, g.group, 60);
      console.log(`[${g.name}]`);
      console.log(`Questionnaire ID: ${g.id}`);
      console.log(`Token: ${token}`);
      console.log(`Demo URL: ?token=${token}`);
      console.log('--------------------------------------------------\n');
    }
  });
}

module.exports = { createToken, verifyToken, DEFAULT_SECRET };
