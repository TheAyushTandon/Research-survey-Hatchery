/**
 * Google Apps Script Web App for:
 * Questionnaire for Incubator Managers and Operational Staff / Faculty Members
 * Supports 2 Distinct Cohorts in ONE Google Sheet:
 * - Tab 1: "Group A - Staff & Managers" (Incubator Heads, Managers & Operational Staff - 10 Questions)
 * - Tab 2: "Group B - Faculty Members" (University Deans, HoDs, and VCs - 10 Questions)
 *
 * HOW TO USE THIS SCRIPT:
 * 1. Open your Institutional Google Sheet.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Delete any code in the editor, and paste this entire script.
 * 4. In the toolbar, select "initialSetup" from the dropdown and click "Run".
 *    (This automatically creates and styles both "Group A" and "Group B" tabs).
 * 5. Click "Deploy" > "Manage deployments" > Edit (Pencil) > New Version > "Deploy".
 *    (Or if new deployment: "Deploy" > "New deployment" > "Web app" > Access: "Anyone").
 */

const SHEET_GROUP_A = "Group A - Staff & Managers";
const SHEET_GROUP_B = "Group B - Faculty Members";
const SHEET_NAME_LOGS = "Audit Log";

const GROUP_A_COLUMNS = [
  {
    "id": "staff_q1",
    "num": "Q1",
    "header": "[Q1] How systematically does your incubator train startups to implement the Build-Measure-Learn feedback loop?"
  },
  {
    "id": "staff_q2",
    "num": "Q2",
    "header": "[Q2] Do you actively facilitate formal joint venture agreements between your incubated startups and external industry partners?"
  },
  {
    "id": "staff_q3",
    "num": "Q3",
    "header": "[Q3] How heavily does your operational staff rely on validated learning metrics over traditional financial metrics when evaluating early-stage startups?"
  },
  {
    "id": "staff_q4",
    "num": "Q4",
    "header": "[Q4] Do you regularly collaborate with regional government bodies to align your incubator's goals with public innovation funding guidelines?"
  },
  {
    "id": "staff_q5",
    "num": "Q5",
    "header": "[Q5] How effectively do your incubator's resources support founders when they need to execute a strategic business model pivot?"
  },
  {
    "id": "staff_q6",
    "num": "Q6",
    "header": "[Q6] Do university-led lab research projects form the primary technology pipeline for new startups entering your incubator?"
  },
  {
    "id": "staff_q7",
    "num": "Q7",
    "header": "[Q7] What level of influence do active industry mentors have on shaping the product-market fit strategies of your startups?"
  },
  {
    "id": "staff_q8",
    "num": "Q8",
    "header": "[Q8] Do administrative or bureaucratic compliance bottlenecks from the host university significantly delay your daily incubator operations?"
  },
  {
    "id": "staff_q9",
    "num": "Q9",
    "header": "[Q9] How consistently do your operational workflows require empirical customer discovery evidence before you allocate internal seed funding?"
  },
  {
    "id": "staff_q10",
    "num": "Q10",
    "header": "[Q10] What is the overall extent of your incubator's reliance on trilateral networks (University-Industry-Government) to sustain its operational model?"
  }
];

const GROUP_B_COLUMNS = [
  {
    "id": "faculty_q1",
    "num": "Q1",
    "header": "[Q1] How actively does your faculty or department leadership promote an entrepreneurial culture alongside traditional basic research academic tracks?"
  },
  {
    "id": "faculty_q2",
    "num": "Q2",
    "header": "[Q2] Do you believe your university’s current tenure and promotion policies sufficiently reward faculty who actively engage in academic entrepreneurship?"
  },
  {
    "id": "faculty_q3",
    "num": "Q3",
    "header": "[Q3] How effectively does your university transfer intellectual property and scientific research to commercial marketplace buyers?"
  },
  {
    "id": "faculty_q4",
    "num": "Q4",
    "header": "[Q4] Do you systematically encourage student researchers to test their technological concepts via customer discovery interviews before submitting peer-reviewed papers?"
  },
  {
    "id": "faculty_q5",
    "num": "Q5",
    "header": "[Q5] What level of structural support does your university leadership receive from government policy frameworks to operationalize incubation infrastructure?"
  },
  {
    "id": "faculty_q6",
    "num": "Q6",
    "header": "[Q6] Do your engineering or business curricula explicitly incorporate Lean Startup methodology concepts like Minimum Viable Product (MVP) design?"
  },
  {
    "id": "faculty_q7",
    "num": "Q7",
    "header": "[Q7] How frequently do active industry experts serve on your academic department's steering committees to co-create market-relevant research agendas?"
  },
  {
    "id": "faculty_q8",
    "num": "Q8",
    "header": "[Q8] Do you face institutional stress between meeting academic publication targets and delivering commercially viable spinoff metrics for the incubator?"
  },
  {
    "id": "faculty_q9",
    "num": "Q9",
    "header": "[Q9] How open is your current executive leadership team to relaxing university equity-share rules to attract private venture capitalist investment?"
  },
  {
    "id": "faculty_q10",
    "num": "Q10",
    "header": "[Q10] What is the overall commitment level of top-tier university administration to building an active local Triple Helix innovation ecosystem?"
  }
];

/**
 * Setup function to create and format the sheets.
 */
function initialSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Setup Group A Sheet
  setupSubSheet(ss, SHEET_GROUP_A, GROUP_A_COLUMNS, "#0f172a");

  // 2. Setup Group B Sheet
  setupSubSheet(ss, SHEET_GROUP_B, GROUP_B_COLUMNS, "#1e293b");

  // 3. Setup Audit Log sheet
  let logSheet = ss.getSheetByName(SHEET_NAME_LOGS);
  if (!logSheet) {
    logSheet = ss.insertSheet(SHEET_NAME_LOGS);
  }
  const logHeaders = ["Timestamp", "Session ID", "Cohort", "Status", "Details"];
  logSheet.getRange(1, 1, 1, logHeaders.length).setValues([logHeaders]);
  const logHeaderRange = logSheet.getRange(1, 1, 1, logHeaders.length);
  logHeaderRange.setBackground("#334155");
  logHeaderRange.setFontColor("#ffffff");
  logHeaderRange.setFontWeight("bold");
  logHeaderRange.setFontFamily("Ubuntu");
  logSheet.setFrozenRows(1);

  // If there is an empty default "Sheet1", remove it
  const defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) {}
  }

  Logger.log("Initial setup complete! Configured both Group A and Group B tabs.");
}

function setupSubSheet(ss, sheetName, columns, headerColor) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 20)).clearContent().clearFormat();
  }

  const baseHeaders = ["Timestamp", "Session ID", "Questionnaire Title"];
  const questionHeaders = columns.map(function(q) { return q.header; });
  const allHeaders = baseHeaders.concat(questionHeaders);

  sheet.getRange(1, 1, 1, allHeaders.length).setValues([allHeaders]);

  const headerRange = sheet.getRange(1, 1, 1, allHeaders.length);
  headerRange.setBackground(headerColor);
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontFamily("Ubuntu");
  headerRange.setFontSize(10);
  headerRange.setWrap(true);

  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2);
  sheet.setRowHeight(1, 45);
}

/**
 * Webhook entry point called by Vercel upon survey completion.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ status: "error", message: "No payload received" }, 400);
    }

    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const sessionId = payload.sessionId || ("anon_" + Utilities.getUuid().slice(0, 8));
    const submittedAt = payload.submittedAt || new Date().toISOString();
    const responses = payload.responses || {};
    const qId = String(payload.questionnaireId || "");

    // Detect whether this is Group A or Group B
    const isGroupA = qId.includes("staff") || responses["staff_q1"] !== undefined;
    const isGroupB = qId.includes("faculty") || responses["faculty_q1"] !== undefined;

    const targetSheetName = isGroupB ? SHEET_GROUP_B : SHEET_GROUP_A;
    const targetColumns = isGroupB ? GROUP_B_COLUMNS : GROUP_A_COLUMNS;
    const titleText = isGroupB 
      ? "Group B: Faculty Members (University Deans, HoDs, and VCs)"
      : "Group A: Incubator Heads, Managers and Operational Staff";

    let targetSheet = ss.getSheetByName(targetSheetName);
    if (!targetSheet) {
      initialSetup();
      targetSheet = ss.getSheetByName(targetSheetName);
    }

    const rowValues = [
      submittedAt,
      sessionId,
      titleText
    ];

    for (let i = 0; i < targetColumns.length; i++) {
      const q = targetColumns[i];
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

    targetSheet.appendRow(rowValues);

    // Write audit log
    let logSheet = ss.getSheetByName(SHEET_NAME_LOGS);
    if (logSheet) {
      logSheet.appendRow([
        submittedAt,
        sessionId,
        isGroupB ? "Group B (Faculty)" : "Group A (Staff)",
        "SUCCESS",
        "Recorded row in '" + targetSheetName + "' with " + targetColumns.length + " entries."
      ]);
    }

    return createJsonResponse({
      status: "success",
      message: "Response recorded successfully in " + targetSheetName,
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

function doGet(e) {
  return createJsonResponse({
    status: "ok",
    service: "Institutional Questionnaire Webhook (Group A & Group B)",
    timestamp: new Date().toISOString()
  });
}

function sanitizeCell(val) {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (/^[=\+\-@\t\r]/.test(s)) {
    return "'" + s;
  }
  return s;
}

function createJsonResponse(obj, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
