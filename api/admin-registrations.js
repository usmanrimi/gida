const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const AUTH_SECRET = process.env.AUTH_SECRET || 'gida_jwt_secret_token_key_2026_secure';
const REGISTRATIONS_FILE = path.join(process.cwd(), 'assets', 'data', 'registrations.json');

function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, receivedSig] = parts;
  const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(encodedPayload).digest('base64url');

  if (receivedSig.length !== expectedSig.length) return null;
  const match = crypto.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expectedSig));
  if (!match) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

async function loadRegistrations() {
  try {
    if (!fs.existsSync(REGISTRATIONS_FILE)) {
      return [];
    }
    const raw = await fs.promises.readFile(REGISTRATIONS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[REGISTRATIONS READ ERROR]', err);
    return [];
  }
}

async function saveRegistrations(records) {
  const dir = path.dirname(REGISTRATIONS_FILE);
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
  const tempFile = REGISTRATIONS_FILE + '.tmp';
  await fs.promises.writeFile(tempFile, JSON.stringify(records, null, 2), 'utf-8');
  await fs.promises.rename(tempFile, REGISTRATIONS_FILE);
}

function escapeCsvCell(val) {
  if (val === null || val === undefined) return '""';
  if (Array.isArray(val)) val = val.join('; ');
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Auth-Token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify Admin Session
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'] || '';
  let token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : authHeader.trim();
  if (!token && req.query && req.query.token) {
    token = String(req.query.token).trim();
  }

  const session = verifySessionToken(token);
  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Super Admin login required.'
    });
  }

  const records = await loadRegistrations();

  // Handle DELETE request
  if (req.method === 'DELETE' || (req.method === 'POST' && req.query.action === 'delete')) {
    let targetId = (req.query.id || '').toString().trim();
    if (!targetId && req.body) {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch(e) { body = {}; }
      }
      targetId = (body.id || '').toString().trim();
    }

    if (!targetId) {
      return res.status(400).json({ success: false, message: 'Missing registration ID to delete.' });
    }

    const initialLen = records.length;
    const remaining = records.filter(r => r.id !== targetId);

    if (remaining.length === initialLen) {
      return res.status(404).json({ success: false, message: `Registration ${targetId} not found.` });
    }

    await saveRegistrations(remaining);
    return res.status(200).json({
      success: true,
      message: `Registration ${targetId} deleted permanently.`,
      remaining: remaining.length
    });
  }

  // Handle GET request (Listing or CSV Export)
  if (req.method === 'GET') {
    const searchQ = (req.query.q || '').toString().trim().toLowerCase();
    const filterArchetype = (req.query.archetype || '').toString().trim();
    const filterFootprint = (req.query.footprint || '').toString().trim();
    const filterConsent = (req.query.consent || '').toString().trim();
    const filterWg = (req.query.workingGroup || '').toString().trim();
    const sortBy = (req.query.sort || 'newest').toString().trim();
    const isExport = req.query.export === 'csv' || req.url.includes('/export');

    let filtered = records.filter(r => {
      if (searchQ) {
        const haystack = [
          r.id, r.fullName, r.email, r.phone, r.organization, r.designation
        ].join(' ').toLowerCase();
        if (!haystack.includes(searchQ)) return false;
      }
      if (filterArchetype && filterArchetype !== 'all') {
        if (!String(r.stakeholderArchetype || '').toLowerCase().includes(filterArchetype.toLowerCase())) {
          return false;
        }
      }
      if (filterFootprint && filterFootprint !== 'all') {
        const fps = (r.operationalFootprint || []).map(f => String(f).toLowerCase());
        if (!fps.some(f => f.includes(filterFootprint.toLowerCase()))) {
          return false;
        }
      }
      if (filterConsent && filterConsent !== 'all') {
        const c = String(r.reportFeatureConsent || '').toLowerCase();
        if (filterConsent === 'publish' && !c.includes('publish')) return false;
        if (filterConsent === 'anonymous' && !c.includes('anonymous') && !c.includes('aggregated')) return false;
      }
      if (filterWg && filterWg !== 'all') {
        if (String(r.workingGroupInterest || '').toLowerCase() !== filterWg.toLowerCase()) {
          return false;
        }
      }
      return true;
    });

    if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => String(a.fullName || '').localeCompare(String(b.fullName || '')));
    } else if (sortBy === 'org') {
      filtered.sort((a, b) => String(a.organization || '').localeCompare(String(b.organization || '')));
    } else {
      filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }

    if (isExport) {
      const headers = [
        'Reference ID',
        'Submitted At (UTC)',
        '1. Full Name',
        '2. Official Email Address',
        '3. Phone Number / WhatsApp',
        '4. Organization / Institution Name',
        '5. Job Title / Designation',
        '6. Primary Operational Footprint',
        '7. Stakeholder Archetype',
        '7. Other Archetype Specification',
        '8. Primary Financial Products/Services',
        '9. Top 3 Barriers to Rural Women FI',
        '10. Biggest Operational Challenge (Max 50 Words)',
        '11. Assets & Capabilities Offered',
        '12. Support & Resource Needed Most',
        '13. Consortium Participation Interest',
        '14. Practical Overlooked Opportunity',
        '15. Successful Project / Pilot Model',
        '16. Report Profile Feature Consent',
        '17. Post-Event Working Group Interest'
      ];

      const rows = [headers.map(escapeCsvCell).join(',')];

      filtered.forEach(r => {
        const row = [
          escapeCsvCell(r.id),
          escapeCsvCell(r.submittedAt),
          escapeCsvCell(r.fullName),
          escapeCsvCell(r.email),
          escapeCsvCell(r.phone),
          escapeCsvCell(r.organization),
          escapeCsvCell(r.designation),
          escapeCsvCell(r.operationalFootprint),
          escapeCsvCell(r.stakeholderArchetype),
          escapeCsvCell(r.stakeholderArchetypeOther),
          escapeCsvCell(r.financialProducts),
          escapeCsvCell(r.topBarriers),
          escapeCsvCell(r.biggestOperationalChallenge),
          escapeCsvCell(r.offerCapabilities),
          escapeCsvCell(r.neededSupport),
          escapeCsvCell(r.consortiumInterest),
          escapeCsvCell(r.overlookedOpportunity),
          escapeCsvCell(r.successfulModel),
          escapeCsvCell(r.reportFeatureConsent),
          escapeCsvCell(r.workingGroupInterest)
        ];
        rows.push(row.join(','));
      });

      const csvContent = '\uFEFF' + rows.join('\r\n');
      const filename = `gida-event-registrations-${new Date().toISOString().slice(0, 10)}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.status(200).send(Buffer.from(csvContent, 'utf-8'));
    }

    return res.status(200).json({
      success: true,
      total: records.length,
      filteredCount: filtered.length,
      registrations: filtered
    });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
};
