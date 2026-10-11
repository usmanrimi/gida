const fs = require('fs');
const path = require('path');

const REGISTRATIONS_FILE = path.join(process.cwd(), 'assets', 'data', 'registrations.json');

function getSheetsWebhookUrl() {
  const envUrl = (process.env.GOOGLE_SHEETS_WEBHOOK_URL || '').trim();
  if (envUrl) return envUrl;
  try {
    const cmsPath = path.join(process.cwd(), 'assets', 'data', 'cms-data.json');
    if (fs.existsSync(cmsPath)) {
      const cmsData = JSON.parse(fs.readFileSync(cmsPath, 'utf8'));
      return (cmsData.googleSheetsWebhookUrl || '').trim();
    }
  } catch (e) {}
  return 'https://script.google.com/macros/s/AKfycbxY4abu_7rFcG9ixvysi5hkQTu_xNImrGs1rq57j8WhTHrt8zFDRxSI2gGFN2TTAmzPUw/exec';
}

async function sendToGoogleSheets(record, webhookUrl) {
  if (!webhookUrl) {
    return { success: false, configured: false, reason: 'unconfigured' };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GIDA-Registration-Sync/1.0'
      },
      body: JSON.stringify(record),
      redirect: 'follow',
      signal: AbortSignal.timeout(12000)
    });

    const text = await res.text();
    if (text.toLowerCase().includes('<!doctype html>') || text.includes('accounts.google.com')) {
      return {
        success: false,
        configured: true,
        error: "Google Web App requires access set to 'Anyone'. Currently redirecting to Google Sign-In."
      };
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text };
    }

    if (res.ok && data.success !== false) {
      return { success: true, configured: true, data };
    } else {
      return {
        success: false,
        configured: true,
        status: res.status,
        error: data.error || data.message || 'Webhook response error.'
      };
    }
  } catch (err) {
    return { success: false, configured: true, error: err.message };
  }
}

async function loadRegistrations() {
  try {
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const raw = await fs.promises.readFile(REGISTRATIONS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    const tmpPath = path.join('/tmp', 'registrations.json');
    if (fs.existsSync(tmpPath)) {
      const raw = await fs.promises.readFile(tmpPath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch (err) {
    console.warn('[REGISTRATIONS READ NOTICE]', err.message);
    return [];
  }
}

async function saveRegistrations(records) {
  try {
    const dir = path.dirname(REGISTRATIONS_FILE);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    const tempFile = REGISTRATIONS_FILE + '.tmp';
    await fs.promises.writeFile(tempFile, JSON.stringify(records, null, 2), 'utf-8');
    await fs.promises.rename(tempFile, REGISTRATIONS_FILE);
  } catch (err) {
    console.warn('[LOCAL STORAGE NOTICE (SERVERLESS/READ-ONLY)]', err.message);
    try {
      const tmpPath = path.join('/tmp', 'registrations.json');
      await fs.promises.writeFile(tmpPath, JSON.stringify(records, null, 2), 'utf-8');
    } catch (e) {}
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Auth-Token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    const data = body || {};

    const errors = {};

    // Section 1: Delegate & Institutional Identity
    const fullName = (data.fullName || '').toString().trim();
    if (fullName.length < 2) {
      errors.fullName = 'Please enter your full name.';
    }

    const email = (data.email || '').toString().trim().toLowerCase();
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid official email address.';
    }

    const phone = (data.phone || '').toString().trim();
    if (phone.length < 7) {
      errors.phone = 'Please enter a valid phone or WhatsApp number.';
    }

    const organization = (data.organization || '').toString().trim();
    if (organization.length < 2) {
      errors.organization = 'Please enter your organization or institution name.';
    }

    const designation = (data.designation || '').toString().trim();
    if (designation.length < 2) {
      errors.designation = 'Please enter your official job title or designation.';
    }

    const operationalFootprint = Array.isArray(data.operationalFootprint) ? data.operationalFootprint : [];
    if (operationalFootprint.length === 0) {
      errors.operationalFootprint = 'Please select at least one operational footprint region in Nigeria.';
    }

    // Section 2: Institutional Role in the FI Ecosystem
    const stakeholderArchetype = (data.stakeholderArchetype || '').toString().trim();
    if (!stakeholderArchetype) {
      errors.stakeholderArchetype = 'Please select a stakeholder archetype that best describes your organization.';
    }
    const stakeholderArchetypeOther = (data.stakeholderArchetypeOther || '').toString().trim();
    if (stakeholderArchetype.toLowerCase().includes('other') && !stakeholderArchetypeOther) {
      errors.stakeholderArchetypeOther = 'Please specify your organization type.';
    }

    const financialProducts = Array.isArray(data.financialProducts) ? data.financialProducts : [];
    if (financialProducts.length === 0) {
      errors.financialProducts = 'Please select at least one primary financial product or service delivered.';
    }

    // Section 3: Ground-Level Challenges & Systemic Bottlenecks
    const topBarriers = Array.isArray(data.topBarriers) ? data.topBarriers : [];
    if (topBarriers.length === 0) {
      errors.topBarriers = 'Please select at least 1 barrier (up to 3).';
    } else if (topBarriers.length > 3) {
      errors.topBarriers = 'Please select a maximum of 3 barriers only.';
    }

    const biggestOperationalChallenge = (data.biggestOperationalChallenge || '').toString().trim();
    if (!biggestOperationalChallenge) {
      errors.biggestOperationalChallenge = 'Please describe the single biggest operational challenge your organization faces.';
    } else {
      const words = biggestOperationalChallenge.split(/\s+/).filter(Boolean);
      if (words.length > 50) {
        errors.biggestOperationalChallenge = `Please limit response to 50 words maximum (currently ${words.length} words).`;
      }
    }

    // Section 4: Collaboration, Public Funds & Ecosystem Synergies
    const offerCapabilities = Array.isArray(data.offerCapabilities) ? data.offerCapabilities : [];
    if (offerCapabilities.length === 0) {
      errors.offerCapabilities = 'Please select at least one asset, capability, or resource offered.';
    }

    const neededSupport = (data.neededSupport || '').toString().trim();
    if (!neededSupport) {
      errors.neededSupport = 'Please select the support or resource you need most.';
    }

    const consortiumInterest = (data.consortiumInterest || '').toString().trim();
    if (!consortiumInterest) {
      errors.consortiumInterest = 'Please select your consortium participation interest.';
    }

    // Section 5: Voice of the Frontline
    const overlookedOpportunity = (data.overlookedOpportunity || '').toString().trim();
    if (overlookedOpportunity.length < 5) {
      errors.overlookedOpportunity = 'Please share a practical overlooked opportunity in rural financial inclusion.';
    }

    const successfulModel = (data.successfulModel || '').toString().trim();
    if (successfulModel.length < 5) {
      errors.successfulModel = 'Please share one successful project, tool, or pilot model.';
    }

    // Section 6: Post-Event Engagement Commitments
    const reportFeatureConsent = (data.reportFeatureConsent || '').toString().trim();
    if (!reportFeatureConsent) {
      errors.reportFeatureConsent = 'Please indicate your report feature preference.';
    }

    const workingGroupInterest = (data.workingGroupInterest || '').toString().trim();
    if (!workingGroupInterest) {
      errors.workingGroupInterest = 'Please indicate if you are interested in post-event working groups.';
    }

    if (Object.keys(errors).length > 0) {
      const firstMsg = Object.values(errors)[0];
      return res.status(400).json({ success: false, message: firstMsg, errors });
    }

    const records = await loadRegistrations();

    // Prevent duplicate submissions from exact same email within 2 minutes
    const now = Date.now();
    for (let i = records.length - 1; i >= 0; i--) {
      const r = records[i];
      if (r.email && r.email.toLowerCase() === email) {
        const submittedTime = new Date(r.submittedAt).getTime();
        if (now - submittedTime < 120000) {
          return res.status(200).json({
            success: true,
            duplicate: true,
            registrationId: r.id,
            registration: r,
            message: 'Existing registration confirmed.'
          });
        }
      }
    }

    // Generate reference ID
    let maxNum = 1000;
    records.forEach(r => {
      const m = String(r.id || '').match(/GIDA-RW2026-(\d+)/);
      if (m) {
        const val = parseInt(m[1], 10);
        if (val > maxNum) maxNum = val;
      }
    });

    const newId = `GIDA-RW2026-${maxNum + 1}`;
    const newRecord = {
      id: newId,
      submittedAt: new Date().toISOString(),
      fullName,
      email,
      phone,
      organization,
      designation,
      operationalFootprint,
      stakeholderArchetype,
      stakeholderArchetypeOther,
      financialProducts,
      topBarriers,
      biggestOperationalChallenge,
      offerCapabilities,
      neededSupport,
      consortiumInterest,
      overlookedOpportunity,
      successfulModel,
      reportFeatureConsent,
      workingGroupInterest,
      status: 'confirmed'
    };

    records.push(newRecord);
    await saveRegistrations(records);

    // Primary destination: Google Sheets integration
    const webhookUrl = getSheetsWebhookUrl();
    const sheetsResult = await sendToGoogleSheets(newRecord, webhookUrl);

    if (!sheetsResult.success) {
      const errMsg = sheetsResult.error || 'Failed to record registration in Google Sheets.';
      newRecord.googleSheetsSynced = false;
      newRecord.googleSheetsError = errMsg;
      await saveRegistrations(records);
      return res.status(502).json({
        success: false,
        message: 'Could not record registration in Google Sheet: ' + errMsg,
        error: errMsg
      });
    }

    newRecord.googleSheetsSynced = true;
    delete newRecord.googleSheetsError;
    await saveRegistrations(records);

    return res.status(200).json({
      success: true,
      registrationId: newId,
      registration: newRecord,
      googleSheetsSynced: true,
      message: 'Registration confirmed and recorded in Google Sheet.'
    });
  } catch (err) {
    console.error('[API REGISTER ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error processing registration: ' + err.message
    });
  }
};
