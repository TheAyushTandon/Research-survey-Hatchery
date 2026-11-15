import { google } from 'googleapis';

// Prevent formula injection
export function sanitizeCell(val: any): string {
  if (val === null || val === undefined) return '';
  const s = typeof val === 'object' ? JSON.stringify(val) : String(val);
  if (/^[=\+\-@\t\r]/.test(s)) {
    return `'${s}`;
  }
  return s;
}

class SheetsStorage {
  private inMemorySessions: Map<string, any> = new Map();
  private inMemoryRespondents: Map<string, any> = new Map();
  private inMemoryResponses: Map<string, any> = new Map();
  private inMemoryLogs: any[] = [];
  private isGoogleConfigured: boolean = false;

  constructor() {
    this.isGoogleConfigured = !!(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
    );
  }

  private getAuth() {
    if (!this.isGoogleConfigured) return null;
    try {
      const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      let key = process.env.GOOGLE_PRIVATE_KEY || '';
      key = key.replace(/\\n/g, '\n');
      return new google.auth.JWT({
        email,
        key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    } catch (e) {
      console.warn('[Google Sheets Auth] Could not initialize JWT, falling back to in-memory store:', e);
      return null;
    }
  }

  async upsertSession(spreadsheetId: string | undefined, session: any) {
    const sId = session.sessionId;
    this.inMemorySessions.set(sId, { ...session, lastUpdatedAt: new Date().toISOString() });

    const auth = this.getAuth();
    if (!auth || !spreadsheetId) return;

    try {
      const sheets = google.sheets({ version: 'v4', auth });
      const row = [
        sanitizeCell(session.sessionId),
        sanitizeCell(session.respondentId),
        sanitizeCell(session.questionnaireId),
        sanitizeCell(session.respondentGroup),
        sanitizeCell(session.startedAt),
        sanitizeCell(session.lastUpdatedAt || new Date().toISOString()),
        sanitizeCell(session.currentSectionId),
        sanitizeCell(session.currentQuestionId),
        sanitizeCell(session.status),
        sanitizeCell(session.submittedAt || ''),
      ];
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sessions!A:J',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [row] },
      });
    } catch (err) {
      console.error('[Google Sheets] Error writing session to spreadsheet:', err);
    }
  }

  async saveRespondent(spreadsheetId: string | undefined, respondent: any, sessionId: string) {
    this.inMemoryRespondents.set(sessionId, respondent);
    const auth = this.getAuth();
    if (!auth || !spreadsheetId) return;

    try {
      const sheets = google.sheets({ version: 'v4', auth });
      const row = [
        sanitizeCell(respondent.respondentId || sessionId),
        sanitizeCell(sessionId),
        sanitizeCell(respondent.fullName),
        sanitizeCell(respondent.designation),
        sanitizeCell(respondent.email),
        sanitizeCell(respondent.phone),
        sanitizeCell(respondent.consentTimestamp ? 'v1.0' : 'none'),
        sanitizeCell(respondent.consentTimestamp || new Date().toISOString()),
      ];
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Respondents!A:H',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [row] },
      });
    } catch (err) {
      console.error('[Google Sheets] Error writing respondent to spreadsheet:', err);
    }
  }

  async saveResponse(spreadsheetId: string | undefined, payload: any) {
    const key = `${payload.sessionId}_${payload.questionId}`;
    this.inMemoryResponses.set(key, {
      ...payload,
      updatedAt: new Date().toISOString(),
    });

    const auth = this.getAuth();
    if (!auth || !spreadsheetId) return;

    try {
      const sheets = google.sheets({ version: 'v4', auth });
      const ansFormatted = Array.isArray(payload.value)
        ? JSON.stringify(payload.value)
        : (payload.otherText ? `${payload.value} (Other: ${payload.otherText})` : String(payload.value));

      const row = [
        sanitizeCell(key),
        sanitizeCell(payload.sessionId),
        sanitizeCell(payload.questionnaireId || ''),
        sanitizeCell(payload.sectionId),
        sanitizeCell(payload.questionId),
        sanitizeCell(payload.questionNumber),
        sanitizeCell(payload.questionText),
        sanitizeCell(ansFormatted),
        sanitizeCell(payload.answeredAt || new Date().toISOString()),
        sanitizeCell(new Date().toISOString()),
      ];
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Responses!A:J',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [row] },
      });
    } catch (err) {
      console.error('[Google Sheets] Error writing response to spreadsheet:', err);
    }
  }

  async logEvent(spreadsheetId: string | undefined, sessionId: string, eventType: string, status: string, errorDetails = '') {
    const logItem = {
      eventId: Math.random().toString(36).substring(2, 9),
      sessionId,
      eventType,
      timestamp: new Date().toISOString(),
      status,
      errorDetails,
    };
    this.inMemoryLogs.push(logItem);

    const auth = this.getAuth();
    if (!auth || !spreadsheetId) return;

    try {
      const sheets = google.sheets({ version: 'v4', auth });
      const row = [
        sanitizeCell(logItem.eventId),
        sanitizeCell(sessionId),
        sanitizeCell(eventType),
        sanitizeCell(logItem.timestamp),
        sanitizeCell(status),
        sanitizeCell(errorDetails),
      ];
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Submission Logs!A:F',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [row] },
      });
    } catch (err) {
      console.error('[Google Sheets] Error writing event log to spreadsheet:', err);
    }
  }

  getSession(sessionId: string) {
    return this.inMemorySessions.get(sessionId) || null;
  }

  getResponsesForSession(sessionId: string) {
    const results: Record<string, any> = {};
    for (const [key, val] of this.inMemoryResponses.entries()) {
      if (key.startsWith(`${sessionId}_`)) {
        results[val.questionId] = {
          value: val.value,
          otherText: val.otherText,
          answeredAt: val.answeredAt || val.updatedAt,
        };
      }
    }
    return results;
  }
}

export const sheetsStorage = new SheetsStorage();
