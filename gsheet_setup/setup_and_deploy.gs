/**
 * ===== ONE-TIME SETUP =====
 * Run this function ONCE to create all sheets and populate config.
 * Go to Apps Script editor → select "setupAll" from the dropdown → click Run.
 */
function setupAll() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- QA Config ---
  var qa = ss.getSheetByName('QA Config') || ss.insertSheet('QA Config');
  qa.clear();
  qa.appendRow(['ID', 'Section', 'Priority', 'Name', 'Description']);
  var qaData = [
    ['A1','Call Introduction & Compliance','P0','Program Identification','Agent correctly states the program name during call opening per branding guidelines.'],
    ['A2','Call Introduction & Compliance','P0','Caller Identification','Agent clearly identifies as calling on behalf of the correct program or organization — no misidentification.'],
    ['A3','Call Introduction & Compliance','P0','Outbound Disclosure (OBD)','Agent provides the required outbound disclosure statement where applicable per program policy.'],
    ['A4','Call Introduction & Compliance','P0','Callback Number Accuracy','If a callback number is provided, it matches the program\'s official number.'],
    ['B1','Medication Handling','P0','Drug Name Pronunciation','Medication names are pronounced clearly and correctly during the call.'],
    ['B2','Medication Handling','P0','Drug Name Documentation','Medication names are spelled correctly in all output documentation — no typos or truncations.'],
    ['B3','Medication Handling','P0','No System Artifacts in Drug Name','No system tags, codes, or metadata appended to the medication name in speech or documentation.'],
    ['C1','Information Accuracy','P0','No Fabricated Information','Agent does not confirm or generate benefit details not stated by the payer. No unverified data in output.'],
    ['C2','Information Accuracy','P0','Call Completion Accuracy','Agent does not declare the call complete while required benefit fields are still missing. Disposition reflects actual state.'],
    ['C3','Information Accuracy','P0','Benefits Output Accuracy','All documented fields (effective/term dates, phone numbers, PA requirements, copay, appeal info) match what the payer stated.'],
    ['D1','Communication Quality','P1','No Overtalk / Communication Lag','Agent does not speak over the payer representative. No excessive delays causing crosstalk or missed information.'],
    ['D2','Communication Quality','P1','Professional Language & Tone','Agent maintains a professional tone throughout the call. Language is clear, courteous, and appropriate.'],
    ['D3','Communication Quality','P1','No Background Noise / Professional Environment','No audible distractions during the call — background noise, interruptions, or environmental issues.'],
    ['D4','Communication Quality','P1','No Fillers or Informal Language','Agent avoids casual fillers and informal language ("yeah", "uh-huh", "like", "you know"). Uses "yes", "understood", "correct" instead.'],
    ['E1','Member Verification & Data','P1','Verification Sequence','Agent follows the standard payer authentication flow — provides patient name and DOB first, then member ID when requested.'],
    ['E2','Member Verification & Data','P1','Patient Data Accuracy','Member identifiers (ID, DOB, zip code, phone) match payer records. No mismatches blocking authentication.'],
    ['F1','Call Efficiency & Process','P2','Within Max Attempt Policy','Total call attempts for this case are within the allowed maximum. Excessive calls risk payer blocking or flagging.'],
    ['F2','Call Efficiency & Process','P2','IVR Navigation','Agent successfully navigated the payer\'s IVR/phone tree to reach a live representative. No hang-ups or misroutes.'],
    ['F3','Call Efficiency & Process','P2','Correct Disposition','Case disposition accurately reflects the call outcome (complete, incomplete, needs follow-up, etc.).']
  ];
  qaData.forEach(function(r) { qa.appendRow(r); });
  qa.autoResizeColumns(1, 5);

  // --- AI Config ---
  var ai = ss.getSheetByName('AI Config') || ss.insertSheet('AI Config');
  ai.clear();
  ai.appendRow(['ID', 'Section', 'Priority', 'Name', 'Description']);
  var aiData = [
    ['S1','Script & Prompt Compliance','Blocker','Call Introduction Matches Approved Script','AI agent\'s opening statement matches the client-approved call script — program name, caller ID, OBD.'],
    ['S2','Script & Prompt Compliance','Blocker','Program Name Correctly Configured','Program name is correctly templated in the agent prompt. Verified across multiple test calls.'],
    ['S3','Script & Prompt Compliance','Blocker','Caller Identification Language Verified','Agent says "calling on behalf of [Program]" — not "on behalf of provider" or any incorrect entity.'],
    ['S4','Script & Prompt Compliance','Blocker','Callback Number Verified','Callback number in agent config matches the program\'s official callback line. Tested in live call.'],
    ['S5','Script & Prompt Compliance','Blocker','Drug Names in Pronunciation Dictionary','All drug names have been added to the TTS pronunciation dictionary with phonetic spellings. Multi-word names tested.'],
    ['S6','Script & Prompt Compliance','Blocker','No System Artifacts in Drug Name Rendering','Drug name rendering verified — no system tags or metadata appended to drug names in speech or output.'],
    ['V1','Conversation & Voice Quality','Blocker','Response Latency ≤ 2s (P95)','95th percentile response latency is under 2 seconds. Measured across test call set.'],
    ['V2','Conversation & Voice Quality','Blocker','VAD Tuned — No Overtalk','VAD thresholds tuned so agent does not speak over the payer rep. Tested with varied payer speech patterns.'],
    ['V3','Conversation & Voice Quality','Warning','Interruption Handling Tested','Agent gracefully handles being interrupted mid-sentence — stops, listens, and resumes appropriately.'],
    ['V4','Conversation & Voice Quality','Warning','End-of-Turn Detection Accurate','Agent correctly detects when the payer has finished speaking. No premature responses or excessive waits.'],
    ['T1','Benefits Data Extraction','Blocker','All Mandatory Fields in Question Template','Agent\'s question template includes every field from the program\'s benefits form. No missing fields.'],
    ['T2','Benefits Data Extraction','Blocker','Entity Extraction Accuracy ≥ 95%','Agent correctly extracts ≥95% of stated entities (dates, names, IDs, phone numbers, amounts) on labeled test set.'],
    ['T3','Benefits Data Extraction','Blocker','Drug Name Correct in Output','Drug name appears correctly in all output fields — no typos, no system tags, no truncation.'],
    ['T4','Benefits Data Extraction','Warning','Verification Sequence Matches Standard Flow','Agent follows standard payer verification sequence (name → DOB → member ID) and does not volunteer info prematurely.'],
    ['E1','Edge Cases & Safety','Blocker','No Hallucination on Empty/Partial Data','Agent does not fabricate or present unverified information as confirmed when data is missing.'],
    ['E2','Edge Cases & Safety','Blocker','AI Detection — Graceful Handling','When payer asks "Are you AI?" or requests a human, agent responds professionally and follows escalation path.'],
    ['E3','Edge Cases & Safety','Blocker','Human Transfer Path Working','Transfer-to-human mechanism is tested and functional. Agent hands off with context when escalation is triggered.'],
    ['E4','Edge Cases & Safety','Blocker','Max Attempt Guardrail Configured','System enforces the max call attempt limit. After limit, case auto-escalates to human queue.'],
    ['E5','Edge Cases & Safety','Warning','IVR Navigation Tested for Top Payers','Agent navigates IVR trees for top payers by volume. Edge cases (member ID format, DTMF vs. speech) verified.'],
    ['E6','Edge Cases & Safety','Warning','Prior Call Context Handling','When resuming a case with prior call data, agent distinguishes between previously collected and new info.'],
    ['E7','Edge Cases & Safety','Warning','Disposition Logic Correct','Agent sets disposition accurately based on what was collected vs. required. No false "complete" on partial data.']
  ];
  aiData.forEach(function(r) { ai.appendRow(r); });
  ai.autoResizeColumns(1, 5);

  // --- Settings ---
  var set = ss.getSheetByName('Settings') || ss.insertSheet('Settings');
  set.clear();
  set.appendRow(['Key', 'Value']);
  set.appendRow(['programs', 'Ipsen,SMPA Orgovyx']);
  set.appendRow(['passThreshold', 80]);
  set.appendRow(['weightP0', 3]);
  set.appendRow(['weightP1', 2]);
  set.appendRow(['weightP2', 1]);
  set.autoResizeColumns(1, 2);

  // --- QA Submissions (empty with headers) ---
  var qaSub = ss.getSheetByName('QA Submissions') || ss.insertSheet('QA Submissions');
  if (qaSub.getLastRow() === 0) {
    qaSub.appendRow(['Timestamp','Program','Reference ID','Case ID','Call Type','Call #','Payer','Call Date','Evaluator','Score (%)','Verdict']);
  }

  // --- AI Submissions (empty with headers) ---
  var aiSub = ss.getSheetByName('AI Submissions') || ss.insertSheet('AI Submissions');
  if (aiSub.getLastRow() === 0) {
    aiSub.appendRow(['Timestamp','Program','Agent Version','Tester','Test Date','Test Calls','Payers','Blocker Fails','Warning Fails','Verdict']);
  }

  // Delete default Sheet1 if it exists and is empty
  var sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1 && sheet1.getLastRow() === 0 && ss.getSheets().length > 1) {
    ss.deleteSheet(sheet1);
  }

  SpreadsheetApp.getUi().alert('Setup complete! All 5 sheets created and populated.\n\nNext: Deploy → New Deployment → Web app.');
}


/**
 * ===== WEB APP HANDLERS =====
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    if (data.action === 'saveConfig') {
      var qaSheet = ss.getSheetByName('QA Config') || ss.insertSheet('QA Config');
      qaSheet.clear();
      qaSheet.appendRow(['ID', 'Section', 'Priority', 'Name', 'Description']);
      (data.qaChecks || []).forEach(function(c) {
        qaSheet.appendRow([c.id, c.section, c.priority, c.name, c.desc]);
      });

      var aiSheet = ss.getSheetByName('AI Config') || ss.insertSheet('AI Config');
      aiSheet.clear();
      aiSheet.appendRow(['ID', 'Section', 'Priority', 'Name', 'Description']);
      (data.aiChecks || []).forEach(function(c) {
        aiSheet.appendRow([c.id, c.section, c.priority, c.name, c.desc]);
      });

      var setSheet = ss.getSheetByName('Settings') || ss.insertSheet('Settings');
      setSheet.clear();
      setSheet.appendRow(['Key', 'Value']);
      var s = data.settings || {};
      setSheet.appendRow(['programs', (s.programs || []).join(',')]);
      setSheet.appendRow(['passThreshold', s.passThreshold || 80]);
      setSheet.appendRow(['weightP0', (s.weights || {}).P0 || 3]);
      setSheet.appendRow(['weightP1', (s.weights || {}).P1 || 2]);
      setSheet.appendRow(['weightP2', (s.weights || {}).P2 || 1]);

      return ContentService.createTextOutput(JSON.stringify({status:'ok', action:'saveConfig'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheetName = data.sheetName || 'QA Submissions';
    var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(data.headers);
    }
    sheet.appendRow(data.row);

    return ContentService.createTextOutput(JSON.stringify({status:'ok'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status:'error', message:err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'status';

  if (action === 'getConfig') {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var result = { qaChecks: [], aiChecks: [], settings: {} };

    var qaSheet = ss.getSheetByName('QA Config');
    if (qaSheet && qaSheet.getLastRow() > 1) {
      var qaData = qaSheet.getRange(2, 1, qaSheet.getLastRow() - 1, 5).getValues();
      result.qaChecks = qaData.map(function(r) {
        return { id: String(r[0]), section: String(r[1]), priority: String(r[2]), name: String(r[3]), desc: String(r[4]) };
      });
    }

    var aiSheet = ss.getSheetByName('AI Config');
    if (aiSheet && aiSheet.getLastRow() > 1) {
      var aiData = aiSheet.getRange(2, 1, aiSheet.getLastRow() - 1, 5).getValues();
      result.aiChecks = aiData.map(function(r) {
        return { id: String(r[0]), section: String(r[1]), priority: String(r[2]), name: String(r[3]), desc: String(r[4]) };
      });
    }

    var setSheet = ss.getSheetByName('Settings');
    if (setSheet && setSheet.getLastRow() > 1) {
      var setData = setSheet.getRange(2, 1, setSheet.getLastRow() - 1, 2).getValues();
      var m = {};
      setData.forEach(function(r) { m[String(r[0])] = r[1]; });
      result.settings = {
        programs: String(m.programs || '').split(',').filter(Boolean),
        passThreshold: Number(m.passThreshold) || 80,
        weights: { P0: Number(m.weightP0) || 3, P1: Number(m.weightP1) || 2, P2: Number(m.weightP2) || 1 }
      };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({status:'ready'}))
    .setMimeType(ContentService.MimeType.JSON);
}
