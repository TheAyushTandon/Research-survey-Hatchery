import json
import os

os.makedirs('google-apps-scripts', exist_ok=True)

# 1. Founders (54 questions)
with open('founders_config.json', 'r', encoding='utf-8') as f:
    founders_config = json.load(f)

founders_questions = []
for sec in founders_config:
    for q in sec['questions']:
        founders_questions.append({
            'id': q['id'],
            'num': q['num'],
            'text': q['text'],
            'section': sec['title']
        })

# 2. Institutional (20 questions)
# Let's read institutional/config/questionnaire.ts
with open('institutional/config/questionnaire.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract json object
json_str = text.split('export const institutionalQuestionnaire: QuestionnaireConfig = ', 1)[1].rsplit(';', 1)[0]
inst_config = json.loads(json_str)

inst_questions = []
for sec in inst_config['sections']:
    for q in sec['questions']:
        inst_questions.append({
            'id': q['id'],
            'num': q['num'],
            'text': q['text'],
            'section': sec['title']
        })

# 3. Government (42 questions)
with open('government_config.json', 'r', encoding='utf-8') as f:
    gov_config = json.load(f)

gov_questions = []
for sec in gov_config:
    for q in sec['questions']:
        gov_questions.append({
            'id': q['id'],
            'num': q.get('num') or q.get('number'),
            'text': q['text'],
            'section': sec['title']
        })

def generate_gas_code(title, cohort, questions, questionnaire_id):
    columns_js = []
    for q in questions:
        clean_text = q['text'].replace('"', '\\"').replace('\n', ' ')
        if len(clean_text) > 80:
            clean_text = clean_text[:77] + '...'
        col_header = f"[{q['num']}] {clean_text}"
        columns_js.append({
            'id': q['id'],
            'num': q['num'],
            'header': col_header
        })

    code = f"""/**
 * Google Apps Script Web App for:
 * {title}
 * Target Cohort: {cohort}
 *
 * HOW TO USE THIS SCRIPT:
 * 1. Create a brand new Google Sheet.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Delete any code in the editor, and paste this entire file.
 * 4. In the toolbar, select "initialSetup" from the dropdown and click "Run".
 *    (Grant the required permissions. This creates the formatted header row with all questions).
 * 5. Click "Deploy" > "New deployment".
 * 6. Click the gear icon next to "Select type" and choose "Web app".
 *    - Description: "Research Survey Webhook"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone" (Required so Vercel can submit responses)
 * 7. Click "Deploy" and copy the Web App URL (starts with https://script.google.com/macros/s/...).
 * 8. In Vercel, go to your project Settings > Environment Variables, and add:
 *    GOOGLE_SHEET_WEBAPP_URL = [Your copied Web App URL]
 */

const QUESTIONNAIRE_ID = "{questionnaire_id}";
const SHEET_NAME_RESPONSES = "Survey Responses";
const SHEET_NAME_LOGS = "Audit Log";

const QUESTION_COLUMNS = {json.dumps(columns_js, indent=2)};

/**
 * Run this function once from the Apps Script editor to create and style the sheets.
 */
function initialSetup() {{
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Setup Survey Responses sheet
  let respSheet = ss.getSheetByName(SHEET_NAME_RESPONSES);
  if (!respSheet) {{
    respSheet = ss.insertSheet(SHEET_NAME_RESPONSES);
  }}
  
  // Base columns + all Question columns
  const baseHeaders = ["Timestamp", "Session ID", "Questionnaire Title"];
  const questionHeaders = QUESTION_COLUMNS.map(function(q) {{ return q.header; }});
  const allHeaders = baseHeaders.concat(questionHeaders);
  
  respSheet.getRange(1, 1, 1, allHeaders.length).setValues([allHeaders]);
  
  // Header styling: Slate header with white bold text
  const headerRange = respSheet.getRange(1, 1, 1, allHeaders.length);
  headerRange.setBackground("#0f172a");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontFamily("Ubuntu");
  headerRange.setFontSize(10);
  headerRange.setWrap(true);
  
  respSheet.setFrozenRows(1);
  respSheet.setFrozenColumns(2);
  respSheet.setRowHeight(1, 45);
  
  // 2. Setup Audit Log sheet
  let logSheet = ss.getSheetByName(SHEET_NAME_LOGS);
  if (!logSheet) {{
    logSheet = ss.insertSheet(SHEET_NAME_LOGS);
  }}
  const logHeaders = ["Timestamp", "Session ID", "Event", "Status", "Details"];
  logSheet.getRange(1, 1, 1, logHeaders.length).setValues([logHeaders]);
  const logHeaderRange = logSheet.getRange(1, 1, 1, logHeaders.length);
  logHeaderRange.setBackground("#334155");
  logHeaderRange.setFontColor("#ffffff");
  logHeaderRange.setFontWeight("bold");
  logHeaderRange.setFontFamily("Ubuntu");
  logSheet.setFrozenRows(1);
  
  Logger.log("Initial setup complete! Configured " + allHeaders.length + " columns.");
}}

/**
 * HTTP POST webhook called by Vercel upon survey completion.
 */
function doPost(e) {{
  const lock = LockService.getScriptLock();
  try {{
    // Wait up to 30 seconds for lock to prevent concurrent write collisions
    lock.waitLock(30000);
    
    if (!e || !e.postData || !e.postData.contents) {{
      return createJsonResponse({{ status: "error", message: "No payload received" }}, 400);
    }}
    
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Ensure responses sheet exists
    let respSheet = ss.getSheetByName(SHEET_NAME_RESPONSES);
    if (!respSheet) {{
      initialSetup();
      respSheet = ss.getSheetByName(SHEET_NAME_RESPONSES);
    }}
    
    const sessionId = payload.sessionId || ("anon_" + Utilities.getUuid().slice(0, 8));
    const submittedAt = payload.submittedAt || new Date().toISOString();
    const responses = payload.responses || {{}};
    
    // Build row values: [Timestamp, Session ID, Title, ...answers in column order]
    const rowValues = [
      submittedAt,
      sessionId,
      "{title}"
    ];
    
    for (let i = 0; i < QUESTION_COLUMNS.length; i++) {{
      const q = QUESTION_COLUMNS[i];
      const respObj = responses[q.id];
      let val = "";
      
      if (respObj) {{
        const rawVal = respObj.value;
        if (Array.isArray(rawVal)) {{
          val = rawVal.join(", ");
        }} else if (rawVal !== undefined && rawVal !== null) {{
          val = String(rawVal);
        }}
        if (respObj.otherText) {{
          val += " (Other: " + respObj.otherText + ")";
        }}
      }}
      
      rowValues.push(sanitizeCell(val));
    }}
    
    respSheet.appendRow(rowValues);
    
    // Write audit log
    let logSheet = ss.getSheetByName(SHEET_NAME_LOGS);
    if (logSheet) {{
      logSheet.appendRow([
        submittedAt,
        sessionId,
        payload.event || "SUBMIT_FORM",
        "SUCCESS",
        "Recorded row with " + QUESTION_COLUMNS.length + " question entries."
      ]);
    }}
    
    return createJsonResponse({{
      status: "success",
      message: "Response recorded successfully",
      sessionId: sessionId,
      timestamp: submittedAt
    }});
    
  }} catch (err) {{
    Logger.log("Error in doPost: " + err.toString());
    return createJsonResponse({{ status: "error", error: err.toString() }}, 500);
  }} finally {{
    lock.releaseLock();
  }}
}}

/**
 * Health-check endpoint
 */
function doGet(e) {{
  return createJsonResponse({{
    status: "ok",
    questionnaireId: QUESTIONNAIRE_ID,
    service: "{title} Webhook",
    timestamp: new Date().toISOString()
  }});
}}

function sanitizeCell(val) {{
  if (val === null || val === undefined) return "";
  const s = String(val);
  // Prevent CSV / formula injection in Google Sheets
  if (/^[=\\+\\-@\\t\\r]/.test(s)) {{
    return "'" + s;
  }}
  return s;
}}

function createJsonResponse(obj, statusCode) {{
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}}
"""
    return code

# Write each script
with open('google-apps-scripts/AppsScript_Founders.js', 'w', encoding='utf-8') as f:
    f.write(generate_gas_code(
        title="To Identify the Factors Affecting the Success of Business Incubators in India",
        cohort="Startup Founders & Entrepreneurs",
        questions=founders_questions,
        questionnaire_id="founders"
    ))

with open('google-apps-scripts/AppsScript_Institutional.js', 'w', encoding='utf-8') as f:
    f.write(generate_gas_code(
        title="Questionnaire for Incubator Managers and Operational Staff / Faculty Members",
        cohort="Incubator Managers, Staff & Faculty Leadership",
        questions=inst_questions,
        questionnaire_id="institutional"
    ))

with open('google-apps-scripts/AppsScript_Government.js', 'w', encoding='utf-8') as f:
    f.write(generate_gas_code(
        title="Government Agency Questionnaire on Business Incubator Support",
        cohort="Government Ministries & Innovation Agencies",
        questions=gov_questions,
        questionnaire_id="government"
    ))

print("Generated all 3 Apps Script files successfully!")
