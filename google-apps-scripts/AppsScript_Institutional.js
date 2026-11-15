/**
 * Google Apps Script Web App for:
 * Questionnaire for Incubator Managers and Operational Staff / Faculty Members
 * Target Cohort: Incubator Managers, Staff & Faculty Leadership
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

const QUESTIONNAIRE_ID = "institutional";
const SHEET_NAME_RESPONSES = "Survey Responses";
const SHEET_NAME_LOGS = "Audit Log";

const QUESTION_COLUMNS = [
  {
    "id": "staff_q1",
    "num": "Q1",
    "header": "[Q1] How systematically does your incubator train startups to implement the Build-..."
  },
  {
    "id": "staff_q2",
    "num": "Q2",
    "header": "[Q2] Do you actively facilitate formal joint venture agreements between your incub..."
  },
  {
    "id": "staff_q3",
    "num": "Q3",
    "header": "[Q3] How heavily does your operational staff rely on validated learning metrics ov..."
  },
  {
    "id": "staff_q4",
    "num": "Q4",
    "header": "[Q4] Do you regularly collaborate with regional government bodies to align your in..."
  },
  {
    "id": "staff_q5",
    "num": "Q5",
    "header": "[Q5] How effectively do your incubator's resources support founders when they need..."
  },
  {
    "id": "staff_q6",
    "num": "Q6",
    "header": "[Q6] Do university-led lab research projects form the primary technology pipeline ..."
  },
  {
    "id": "staff_q7",
    "num": "Q7",
    "header": "[Q7] What level of influence do active industry mentors have on shaping the produc..."
  },
  {
    "id": "staff_q8",
    "num": "Q8",
    "header": "[Q8] Do administrative or bureaucratic compliance bottlenecks from the host univer..."
  },
  {
    "id": "staff_q9",
    "num": "Q9",
    "header": "[Q9] How consistently do your operational workflows require empirical customer dis..."
  },
  {
    "id": "staff_q10",
    "num": "Q10",
    "header": "[Q10] What is the overall extent of your incubator's reliance on trilateral network..."
  },
  {
    "id": "faculty_q1",
    "num": "Q1",
    "header": "[Q1] How actively does your faculty or department leadership promote an entreprene..."
  },
  {
    "id": "faculty_q2",
    "num": "Q2",
    "header": "[Q2] Do you believe your university\u2019s current tenure and promotion policies suffic..."
  },
  {
    "id": "faculty_q3",
    "num": "Q3",
    "header": "[Q3] How effectively does your university transfer intellectual property and scien..."
  },
  {
    "id": "faculty_q4",
    "num": "Q4",
    "header": "[Q4] Do you systematically encourage student researchers to test their technologic..."
  },
  {
    "id": "faculty_q5",
    "num": "Q5",
    "header": "[Q5] What level of structural support does your university leadership receive from..."
  },
  {
    "id": "faculty_q6",
    "num": "Q6",
    "header": "[Q6] Do your engineering or business curricula explicitly incorporate Lean Startup..."
  },
  {
    "id": "faculty_q7",
    "num": "Q7",
    "header": "[Q7] How frequently do active industry experts serve on your academic department's..."
  },
  {
    "id": "faculty_q8",
    "num": "Q8",
    "header": "[Q8] Do you face institutional stress between meeting academic publication targets..."
  },
  {
    "id": "faculty_q9",
    "num": "Q9",
    "header": "[Q9] How open is your current executive leadership team to relaxing university equ..."
  },
  {
    "id": "faculty_q10",
    "num": "Q10",
    "header": "[Q10] What is the overall commitment level of top-tier university administration to..."
  }
];

/**
 * Run this function once from the Apps Script editor to create and style the sheets.
 */
function initialSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Setup Survey Responses sheet
  let respSheet = ss.getSheetByName(SHEET_NAME_RESPONSES);
  if (!respSheet) {
    respSheet = ss.insertSheet(SHEET_NAME_RESPONSES);
  } else {
    // Clear old row 1 headers if re-running setup
    respSheet.getRange(1, 1, 1, Math.max(respSheet.getLastColumn(), 30)).clearContent().clearFormat();
  }
  
  // Base columns + all Question columns
  const baseHeaders = ["Timestamp", "Session ID", "Questionnaire Title"];
  const questionHeaders = QUESTION_COLUMNS.map(function(q) { return q.header; });
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
  if (!logSheet) {
    logSheet = ss.insertSheet(SHEET_NAME_LOGS);
  }
  const logHeaders = ["Timestamp", "Session ID", "Event", "Status", "Details"];
  logSheet.getRange(1, 1, 1, logHeaders.length).setValues([logHeaders]);
  const logHeaderRange = logSheet.getRange(1, 1, 1, logHeaders.length);
  logHeaderRange.setBackground("#334155");
  logHeaderRange.setFontColor("#ffffff");
  logHeaderRange.setFontWeight("bold");
  logHeaderRange.setFontFamily("Ubuntu");
  logSheet.setFrozenRows(1);
  
  Logger.log("Initial setup complete! Configured " + allHeaders.length + " columns.");
}

/**
 * HTTP POST webhook called by Vercel upon survey completion.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // Wait up to 30 seconds for lock to prevent concurrent write collisions
    lock.waitLock(30000);
    
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ status: "error", message: "No payload received" }, 400);
    }
    
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Ensure responses sheet exists
    let respSheet = ss.getSheetByName(SHEET_NAME_RESPONSES);
    if (!respSheet) {
      initialSetup();
      respSheet = ss.getSheetByName(SHEET_NAME_RESPONSES);
    }
    
    const sessionId = payload.sessionId || ("anon_" + Utilities.getUuid().slice(0, 8));
    const submittedAt = payload.submittedAt || new Date().toISOString();
    const responses = payload.responses || {};
    
    // Build row values: [Timestamp, Session ID, Title, ...answers in column order]
    const rowValues = [
      submittedAt,
      sessionId,
      "Questionnaire for Incubator Managers and Operational Staff / Faculty Members"
    ];
    
    for (let i = 0; i < QUESTION_COLUMNS.length; i++) {
      const q = QUESTION_COLUMNS[i];
      const respObj = responses[q.id] || responses[q.num];
      let val = "";
      
      if (respObj !== undefined && respObj !== null) {
        if (typeof respObj === 'object' && !Array.isArray(respObj) && respObj.value !== undefined) {
          const rawVal = respObj.value;
          if (Array.isArray(rawVal)) {
            val = rawVal.join(", ");
          } else if (rawVal !== undefined && rawVal !== null) {
            val = String(rawVal);
          }
          if (respObj.otherText) {
            val += " (Other: " + respObj.otherText + ")";
          }
        } else if (Array.isArray(respObj)) {
          val = respObj.join(", ");
        } else {
          val = String(respObj);
        }
      }
      
      rowValues.push(sanitizeCell(val));
    }
    
    respSheet.appendRow(rowValues);
    
    // Write audit log
    let logSheet = ss.getSheetByName(SHEET_NAME_LOGS);
    if (logSheet) {
      logSheet.appendRow([
        submittedAt,
        sessionId,
        payload.event || "SUBMIT_FORM",
        "SUCCESS",
        "Recorded row with " + QUESTION_COLUMNS.length + " question entries."
      ]);
    }
    
    return createJsonResponse({
      status: "success",
      message: "Response recorded successfully",
      sessionId: sessionId,
      timestamp: submittedAt
    });
    
  } catch (err) {
    Logger.log("Error in doPost: " + err.toString());
    return createJsonResponse({ status: "error", error: err.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Health-check endpoint
 */
function doGet(e) {
  return createJsonResponse({
    status: "ok",
    questionnaireId: QUESTIONNAIRE_ID,
    service: "Questionnaire for Incubator Managers and Operational Staff / Faculty Members Webhook",
    timestamp: new Date().toISOString()
  });
}

function sanitizeCell(val) {
  if (val === null || val === undefined) return "";
  const s = String(val);
  // Prevent CSV / formula injection in Google Sheets
  if (/^[=\+\-@\t\r]/.test(s)) {
    return "'" + s;
  }
  return s;
}

function createJsonResponse(obj, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
