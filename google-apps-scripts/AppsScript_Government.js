/**
 * Google Apps Script Web App for:
 * Government Agency Questionnaire on Business Incubator Support
 * Target Cohort: Government Ministries & Innovation Agencies
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

const QUESTIONNAIRE_ID = "government";
const SHEET_NAME_RESPONSES = "Survey Responses";
const SHEET_NAME_LOGS = "Audit Log";

const QUESTION_COLUMNS = [
  {
    "id": "gov_a_q1",
    "num": "Q1",
    "header": "[Q1] Which type of government organization do you represent?"
  },
  {
    "id": "gov_a_q2",
    "num": "Q2",
    "header": "[Q2] What is your current designation?"
  },
  {
    "id": "gov_a_q3",
    "num": "Q3",
    "header": "[Q3] How many years have you been associated with innovation, entrepreneurship, or..."
  },
  {
    "id": "gov_a_q4",
    "num": "Q4",
    "header": "[Q4] Which sector does your organization primarily support? (Multiple selections a..."
  },
  {
    "id": "gov_a_q5",
    "num": "Q5",
    "header": "[Q5] Which activities does your organization undertake related to Academic Busines..."
  },
  {
    "id": "gov_a_q6",
    "num": "Q6",
    "header": "[Q6] How frequently does your organization interact with Academic Business Incubat..."
  },
  {
    "id": "gov_a_q7",
    "num": "Q7",
    "header": "[Q7] Approximately how many Academic Business Incubators does your organization cu..."
  },
  {
    "id": "gov_a_q8",
    "num": "Q8",
    "header": "[Q8] Which forms of support are provided by your organization? (Select all that ap..."
  },
  {
    "id": "gov_a_q9",
    "num": "Q9",
    "header": "[Q9] Which stage of startup development receives the highest support from your org..."
  },
  {
    "id": "gov_a_q10",
    "num": "Q10",
    "header": "[Q10] Which performance indicators are primarily used to evaluate Academic Business..."
  },
  {
    "id": "gov_a_q11",
    "num": "Q11",
    "header": "[Q11] Which government schemes/programmes is your organization associated with? (Se..."
  },
  {
    "id": "gov_a_q12",
    "num": "Q12",
    "header": "[Q12] In your opinion, what is the primary objective of Academic Business Incubators?"
  },
  {
    "id": "gov_h1_q1",
    "num": "Q1",
    "header": "[Q1] Government financial help has made the facilities and technology much better ..."
  },
  {
    "id": "gov_h1_q2",
    "num": "Q2",
    "header": "[Q2] Incubators with strong government backing offer better workspaces and labs th..."
  },
  {
    "id": "gov_h1_q3",
    "num": "Q3",
    "header": "[Q3] Government rules make it easier for our incubator to find and attract differe..."
  },
  {
    "id": "gov_h1_q4",
    "num": "Q4",
    "header": "[Q4] Government grants and funding programs have directly increased the investors ..."
  },
  {
    "id": "gov_h1_q5",
    "num": "Q5",
    "header": "[Q5] Helpful government rules reduce paperwork and delays, letting our incubator f..."
  },
  {
    "id": "gov_h1_q6",
    "num": "Q6",
    "header": "[Q6] Government funding has enabled our incubator to acquire modern equipment, lab..."
  },
  {
    "id": "gov_h1_q7",
    "num": "Q7",
    "header": "[Q7] Government-supported infrastructure has improved startups' access to technica..."
  },
  {
    "id": "gov_h1_q8",
    "num": "Q8",
    "header": "[Q8] Government financial support has increased the incubator's ability to provide..."
  },
  {
    "id": "gov_h1_q9",
    "num": "Q9",
    "header": "[Q9] Government policies encourage partnerships between academic incubators, indus..."
  },
  {
    "id": "gov_h1_q10",
    "num": "Q10",
    "header": "[Q10] Overall, government financial and regulatory support has significantly streng..."
  },
  {
    "id": "gov_h2_q1",
    "num": "Q1",
    "header": "[Q1] When the government, companies, and universities work together, it helps new ..."
  },
  {
    "id": "gov_h2_q2",
    "num": "Q2",
    "header": "[Q2] Having access to joint programs helps founders avoid government red tape and ..."
  },
  {
    "id": "gov_h2_q3",
    "num": "Q3",
    "header": "[Q3] Strong teamwork between these three groups shortens the time it takes for a f..."
  },
  {
    "id": "gov_h2_q4",
    "num": "Q4",
    "header": "[Q4] Advice from industry experts through the incubator helps founders test and ru..."
  },
  {
    "id": "gov_h2_q5",
    "num": "Q5",
    "header": "[Q5] Getting support and guidance from policymakers, business experts, and teacher..."
  },
  {
    "id": "gov_h2_q6",
    "num": "Q6",
    "header": "[Q6] How effectively do Lean Startup practices help founders utilize government fu..."
  },
  {
    "id": "gov_h2_q7",
    "num": "Q7",
    "header": "[Q7] Compared with traditional approaches, how efficiently does the Lean Startup a..."
  },
  {
    "id": "gov_h2_q8",
    "num": "Q8",
    "header": "[Q8] To what extent does the Lean Startup approach reduce unnecessary expenditure ..."
  },
  {
    "id": "gov_h2_q9",
    "num": "Q9",
    "header": "[Q9] How helpful are Lean Startup practices in enabling founders to quickly respon..."
  },
  {
    "id": "gov_h2_q10",
    "num": "Q10",
    "header": "[Q10] How much has the Lean Startup approach improved your startup's ability to max..."
  },
  {
    "id": "gov_c_q1",
    "num": "Q1",
    "header": "[Q1] Do university-industry-government interactions accelerate incubators\u2019 develop..."
  },
  {
    "id": "gov_c_q2",
    "num": "Q2",
    "header": "[Q2] Do collaborative research centers enable academic-industry partnerships to de..."
  },
  {
    "id": "gov_c_q3",
    "num": "Q3",
    "header": "[Q3] Do you think the joint mentoring programs of university faculty members and i..."
  },
  {
    "id": "gov_c_q4",
    "num": "Q4",
    "header": "[Q4] Do the government policies ease the process of university researchers selling..."
  },
  {
    "id": "gov_c_q5",
    "num": "Q5",
    "header": "[Q5] Does academic research commercialization align with industry market trends an..."
  },
  {
    "id": "gov_c_q6",
    "num": "Q6",
    "header": "[Q6] Do the Government and industry-sponsored grants ensure adequate seed capital ..."
  },
  {
    "id": "gov_c_q7",
    "num": "Q7",
    "header": "[Q7] Do you think bureaucratic hurdles between administrative executives and corpo..."
  },
  {
    "id": "gov_c_q8",
    "num": "Q8",
    "header": "[Q8] Do industry hackathons at the university promote viable tech start-ups?"
  },
  {
    "id": "gov_c_q9",
    "num": "Q9",
    "header": "[Q9] Do government policies encourage businesses to sponsor academic incubators?"
  },
  {
    "id": "gov_c_q10",
    "num": "Q10",
    "header": "[Q10] Do collaborative ties ensure our incubator's sustainability?"
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
      "Government Agency Questionnaire on Business Incubator Support"
    ];
    
    for (let i = 0; i < QUESTION_COLUMNS.length; i++) {
      const q = QUESTION_COLUMNS[i];
      const respObj = responses[q.id];
      let val = "";
      
      if (respObj) {
        const rawVal = respObj.value;
        if (Array.isArray(rawVal)) {
          val = rawVal.join(", ");
        } else if (rawVal !== undefined && rawVal !== null) {
          val = String(rawVal);
        }
        if (respObj.otherText) {
          val += " (Other: " + respObj.otherText + ")";
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
    service: "Government Agency Questionnaire on Business Incubator Support Webhook",
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
