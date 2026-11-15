/**
 * Google Apps Script Web App for:
 * To Identify the Factors Affecting the Success of Business Incubators in India
 * Target Cohort: Startup Founders & Entrepreneurs
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

const QUESTIONNAIRE_ID = "founders";
const SHEET_NAME_RESPONSES = "Survey Responses";
const SHEET_NAME_LOGS = "Audit Log";

const QUESTION_COLUMNS = [
  {
    "id": "founders_sec_a_q1",
    "num": "Q1",
    "header": "[Q1] What is your gender?"
  },
  {
    "id": "founders_sec_a_q2",
    "num": "Q2",
    "header": "[Q2] What is your age group?"
  },
  {
    "id": "founders_sec_a_q3",
    "num": "Q3",
    "header": "[Q3] What is your highest educational qualification?"
  },
  {
    "id": "founders_sec_a_q4",
    "num": "Q4",
    "header": "[Q4] What is your role in the startup?"
  },
  {
    "id": "founders_sec_a_q5",
    "num": "Q5",
    "header": "[Q5] How long has your startup been operating?"
  },
  {
    "id": "founders_sec_a_q6",
    "num": "Q6",
    "header": "[Q6] Which stage best describes your startup?"
  },
  {
    "id": "founders_sec_a_q7",
    "num": "Q7",
    "header": "[Q7] Which sector does your startup primarily operate in?"
  },
  {
    "id": "founders_sec_a_q8",
    "num": "Q8",
    "header": "[Q8] Is your startup currently incubated?"
  },
  {
    "id": "founders_sec_a_q9",
    "num": "Q9",
    "header": "[Q9] What type of incubator supports your startup?"
  },
  {
    "id": "founders_sec_a_q10",
    "num": "Q10",
    "header": "[Q10] How long have you been associated with the incubator?"
  },
  {
    "id": "founders_sec_a_q11",
    "num": "Q11",
    "header": "[Q11] How did you first learn about the incubator?"
  },
  {
    "id": "founders_sec_a_q12",
    "num": "Q12",
    "header": "[Q12] Why did you choose this incubator? (Select all that apply)"
  },
  {
    "id": "founders_sec_a_q13",
    "num": "Q13",
    "header": "[Q13] Which services have you received from the incubator? (Select all that apply)"
  },
  {
    "id": "founders_sec_a_q14",
    "num": "Q14",
    "header": "[Q14] Which source provided your initial funding?"
  },
  {
    "id": "founders_sec_a_q15",
    "num": "Q15",
    "header": "[Q15] What is the current size of your startup?"
  },
  {
    "id": "founders_sec_a_q16",
    "num": "Q16",
    "header": "[Q16] Has your startup received Intellectual Property (IP) support? (Select all tha..."
  },
  {
    "id": "founders_sec_a_q17",
    "num": "Q17",
    "header": "[Q17] Which of the following best describes your primary customer?"
  },
  {
    "id": "founders_sec_a_q18",
    "num": "Q18",
    "header": "[Q18] How often do you interact with your incubator mentors?"
  },
  {
    "id": "founders_sec_a_q19",
    "num": "Q19",
    "header": "[Q19] What is the biggest challenge faced by your startup? (Select up to three)"
  },
  {
    "id": "founders_sec_a_q20",
    "num": "Q20",
    "header": "[Q20] What outcomes has your startup achieved through incubation? (Select all that ..."
  },
  {
    "id": "founders_sec_a_q21",
    "num": "Q21",
    "header": "[Q21] What type of collaboration has most benefited your startup?"
  },
  {
    "id": "founders_sec_a_q22",
    "num": "Q22",
    "header": "[Q22] What is your future business goal?"
  },
  {
    "id": "founders_sec_a_q23",
    "num": "Q23",
    "header": "[Q23] Would you recommend your incubator to other entrepreneurs?"
  },
  {
    "id": "founders_sec_a_q24",
    "num": "Q24",
    "header": "[Q24] How satisfied are you with your incubation experience?"
  },
  {
    "id": "founders_sec_b_h1_q1",
    "num": "Q1",
    "header": "[Q1] Mentors at our incubator heavily teach \\\"Lean Start-up\\\" ideas, like testing ..."
  },
  {
    "id": "founders_sec_b_h1_q2",
    "num": "Q2",
    "header": "[Q2] Using Lean strategies like knowing when to change direction (pivot) helps our..."
  },
  {
    "id": "founders_sec_b_h1_q3",
    "num": "Q3",
    "header": "[Q3] Start-ups that follow the Lean advice given by their mentors handle market ch..."
  },
  {
    "id": "founders_sec_b_h1_q4",
    "num": "Q4",
    "header": "[Q4] Regular mentor advice focused on customer feedback helps start-ups build prod..."
  },
  {
    "id": "founders_sec_b_h1_q5",
    "num": "Q5",
    "header": "[Q5] Start-ups using Lean methods fail much less often compared to those using old..."
  },
  {
    "id": "founders_sec_b_h1_q6",
    "num": "Q6",
    "header": "[Q6] How often do mentors encourage your startup to validate business ideas with p..."
  },
  {
    "id": "founders_sec_b_h1_q7",
    "num": "Q7",
    "header": "[Q7] To what extent has mentorship on developing a Minimum Viable Product (MVP) he..."
  },
  {
    "id": "founders_sec_b_h1_q8",
    "num": "Q8",
    "header": "[Q8] How effective has mentor guidance been in helping your startup quickly adapt ..."
  },
  {
    "id": "founders_sec_b_h1_q9",
    "num": "Q9",
    "header": "[Q9] Which best describes the impact of Lean Startup mentoring on your startup's a..."
  },
  {
    "id": "founders_sec_b_h1_q10",
    "num": "Q10",
    "header": "[Q10] How much has Lean Startup-oriented mentorship contributed to the long-term su..."
  },
  {
    "id": "founders_sec_b_h2_q1",
    "num": "Q1",
    "header": "[Q1] Founders who use Lean methods are better at making the most of government gra..."
  },
  {
    "id": "founders_sec_b_h2_q2",
    "num": "Q2",
    "header": "[Q2] Traditional planners often waste or misuse government support because their s..."
  },
  {
    "id": "founders_sec_b_h2_q3",
    "num": "Q3",
    "header": "[Q3] Lean founders use government-backed perks (like tax breaks or funds) for prod..."
  },
  {
    "id": "founders_sec_b_h2_q4",
    "num": "Q4",
    "header": "[Q4] The flexible nature of Lean methods makes it easier for founders to meet gove..."
  },
  {
    "id": "founders_sec_b_h2_q5",
    "num": "Q5",
    "header": "[Q5] Founders who use Lean principles get a better return on investment from gover..."
  },
  {
    "id": "founders_sec_b_h2_q6",
    "num": "Q6",
    "header": "[Q6] How effectively do Lean Startup practices help founders utilize government fu..."
  },
  {
    "id": "founders_sec_b_h2_q7",
    "num": "Q7",
    "header": "[Q7] Compared with traditional approaches, how efficiently does the Lean Startup a..."
  },
  {
    "id": "founders_sec_b_h2_q8",
    "num": "Q8",
    "header": "[Q8] To what extent does the Lean Startup approach reduce unnecessary expenditure ..."
  },
  {
    "id": "founders_sec_b_h2_q9",
    "num": "Q9",
    "header": "[Q9] How helpful are Lean Startup practices in enabling founders to quickly respon..."
  },
  {
    "id": "founders_sec_b_h2_q10",
    "num": "Q10",
    "header": "[Q10] How much has the Lean Startup approach improved your startup's ability to max..."
  },
  {
    "id": "founders_sec_c_q1",
    "num": "Q1",
    "header": "[Q1] Does the incubator facilitate interactions between university researchers and..."
  },
  {
    "id": "founders_sec_c_q2",
    "num": "Q2",
    "header": "[Q2] Does the incubator offer university research, technical expertise, and lab fa..."
  },
  {
    "id": "founders_sec_c_q3",
    "num": "Q3",
    "header": "[Q3] Does the incubator offer good access to the industry partners and markets?"
  },
  {
    "id": "founders_sec_c_q4",
    "num": "Q4",
    "header": "[Q4] Do corporate mentors provide valuable insight into the market entry and comme..."
  },
  {
    "id": "founders_sec_c_q5",
    "num": "Q5",
    "header": "[Q5] Does the incubator facilitate connections to relevant government programs and..."
  },
  {
    "id": "founders_sec_c_q6",
    "num": "Q6",
    "header": "[Q6] Does incubator support help your start-up comply with policy and legal regula..."
  },
  {
    "id": "founders_sec_c_q7",
    "num": "Q7",
    "header": "[Q7] Do government programs in the incubator help you build relationships with res..."
  },
  {
    "id": "founders_sec_c_q8",
    "num": "Q8",
    "header": "[Q8] Does the incubator effectively bridge university, industry, and government re..."
  },
  {
    "id": "founders_sec_c_q9",
    "num": "Q9",
    "header": "[Q9] Do collaborative projects help shorten product development cycles?"
  },
  {
    "id": "founders_sec_c_q10",
    "num": "Q10",
    "header": "[Q10] Does the cooperation between university, industry, and government contribute ..."
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
    respSheet.getRange(1, 1, 1, Math.max(respSheet.getLastColumn(), 60)).clearContent().clearFormat();
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
      "To Identify the Factors Affecting the Success of Business Incubators in India"
    ];
    
    for (let i = 0; i < QUESTION_COLUMNS.length; i++) {
      const q = QUESTION_COLUMNS[i];
      const respObj = responses[q.id] || responses[q.id.replace('founders_', '')] || responses[q.num];
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
    service: "To Identify the Factors Affecting the Success of Business Incubators in India Webhook",
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
