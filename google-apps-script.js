/**
 * ============================================================================
 * GIDA - Growth Innovation for Development Action
 * Event: International Day for Rural Women 2026
 * Theme: "Rural Women Rising — Strengthening the Frontline in Nigeria"
 * 
 * Google Apps Script: Automated Google Sheets Registration Webhook
 * Target Spreadsheet: https://docs.google.com/spreadsheets/d/1Wl1rhD_nZh5iQ1ibGwAhSPvAd4BOJQAt_kVJehTxzj8/edit
 * ============================================================================
 * 
 * INSTRUCTIONS TO DEPLOY:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1Wl1rhD_nZh5iQ1ibGwAhSPvAd4BOJQAt_kVJehTxzj8/edit
 * 2. In the top menu, click Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this entire script, and click Save (disk icon).
 * 4. Click the blue "Deploy" button (top right) > "New deployment".
 * 5. Click the gear icon next to "Select type" and choose "Web app".
 * 6. Set Description: "GIDA Event Registration Webhook".
 * 7. Set "Execute as": "Me" (your Google account).
 * 8. Set "Who has access": "Anyone" (allows GIDA backend to submit entries).
 * 9. Click "Deploy", authorize permissions when prompted, and COPY the Web App URL:
 *    (e.g., https://script.google.com/macros/s/AKfycbx.../exec)
 * 10. Paste this URL into your Super Admin Event Registrations tab OR set as GOOGLE_SHEETS_WEBHOOK_URL.
 */

const SPREADSHEET_ID = '1Wl1rhD_nZh5iQ1ibGwAhSPvAd4BOJQAt_kVJehTxzj8';
const SHEET_NAME = 'Registrations';

// Authoritative 21-column header structure matching all 17 questionnaire items + metadata
const COLUMN_HEADERS = [
  'Registration ID',
  'Submission Timestamp (UTC)',
  'Full Name',
  'Email Address',
  'Phone / WhatsApp',
  'Organization / Institution',
  'Designation / Role',
  'Operational Footprint (Geopolitical Zones)',
  'Primary Stakeholder Archetype',
  'Stakeholder Archetype (Other / Specification)',
  'Financial Products & Services Deployed',
  'Top 3 Barriers to Rural Women Financial Inclusion',
  'Single Biggest Operational Challenge (Max 50 Words)',
  'Assets, Capabilities & Resources Offered',
  'Support / Resource Needed Most',
  'Consortium Participation Interest',
  'Practical Overlooked Opportunity to Prioritize',
  'Successful Project, Tool, or Pilot Model',
  'Feature Profile in 2026 Ecosystem Report (Consent)',
  'Post-Event Working Group Interest',
  'Status'
];

function getTargetSheet() {
  var ss = null;
  // First attempt container-bound spreadsheet (highest reliability, no Drive permissions needed)
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    ss = null;
  }

  // Fallback to explicit ID if running as standalone script
  if (!ss && SPREADSHEET_ID && SPREADSHEET_ID !== '') {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      Logger.log('Could not open spreadsheet by ID: ' + e.toString());
    }
  }

  if (!ss) {
    throw new Error('Spreadsheet could not be accessed. Please ensure this script is attached to the spreadsheet (Extensions > Apps Script) or that the account has access to ID: ' + SPREADSHEET_ID);
  }

  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
    try {
      sheet.setName(SHEET_NAME);
    } catch (e) {}
  }

  // Ensure header row is set up with professional styling
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMN_HEADERS);
    var headerRange = sheet.getRange(1, 1, 1, COLUMN_HEADERS.length);
    headerRange.setBackground('#0d231d');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(10);
    headerRange.setWrap(true);
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 38);
    for (var col = 1; col <= COLUMN_HEADERS.length; col++) {
      sheet.setColumnWidth(col, 200);
    }
    sheet.setColumnWidth(1, 160); // ID
    sheet.setColumnWidth(2, 180); // Timestamp
    sheet.setColumnWidth(3, 180); // Name
    sheet.setColumnWidth(4, 220); // Email
    sheet.setColumnWidth(13, 300); // Biggest Challenge
    sheet.setColumnWidth(17, 300); // Overlooked Opportunity
    sheet.setColumnWidth(18, 300); // Successful Model
  }

  return sheet;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Acquire lock for up to 10 seconds to prevent race conditions during high traffic
    lock.waitLock(10000);

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var sheet = getTargetSheet();

    // Format list fields
    function formatList(val) {
      if (!val) return '';
      if (Array.isArray(val)) return val.join('; ');
      return String(val);
    }

    var regId = data.id || ('GIDA-RW2026-' + (sheet.getLastRow() + 1000));
    var submittedAt = data.submittedAt || new Date().toISOString();

    var row = [
      regId,
      submittedAt,
      data.fullName || '',
      data.email || '',
      data.phone || '',
      data.organization || '',
      data.designation || '',
      formatList(data.operationalFootprint),
      data.stakeholderArchetype || '',
      data.stakeholderArchetypeOther || '',
      formatList(data.financialProducts),
      formatList(data.topBarriers),
      data.biggestOperationalChallenge || '',
      formatList(data.offerCapabilities),
      data.neededSupport || '',
      data.consortiumInterest || '',
      data.overlookedOpportunity || '',
      data.successfulModel || '',
      data.reportFeatureConsent || '',
      data.workingGroupInterest || '',
      data.status || 'confirmed'
    ];

    sheet.appendRow(row);

    var responseData = {
      success: true,
      id: regId,
      rowNumber: sheet.getLastRow(),
      message: 'Registration recorded successfully in Google Sheet.'
    };

    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString(),
      message: 'Failed to write registration to Google Sheet.'
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

function doGet(e) {
  try {
    var sheet = getTargetSheet();
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ok',
      service: 'GIDA Event Registration Google Sheets Webhook',
      sheetName: sheet.getName(),
      totalRows: sheet.getLastRow() - 1,
      targetSheetUrl: 'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/edit',
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
