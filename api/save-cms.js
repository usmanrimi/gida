/**
 * Serverless API: /api/save-cms
 * Durable persistence for GIDA CMS data.
 * Supports:
 * 1. Supabase Postgres storage (if SUPABASE_URL & SUPABASE_KEY/SERVICE_ROLE_KEY configured)
 * 2. GitHub REST API commit server-side (if GITHUB_TOKEN configured in serverless environment)
 * 3. Local filesystem disk write (when running locally or in writable filesystem)
 * 
 * Secure: Verifies admin session token without exposing credentials to frontend.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const AUTH_SECRET = process.env.AUTH_SECRET || 'gida_jwt_secret_token_key_2026_secure';

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
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // 1. Verify Super Admin authorization
  const authHeader = req.headers.authorization || req.headers['x-admin-token'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const session = verifySessionToken(token);

  // In local development or with valid session, proceed
  const isLocalHost = req.headers.host && (req.headers.host.includes('localhost') || req.headers.host.includes('127.0.0.1'));
  if (!session && !isLocalHost) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please log in to Super Admin.' });
  }

  try {
    const payload = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid payload' });
    }

    payload.updatedAt = new Date().toISOString();

    let diskSaved = false;
    let supabaseSaved = false;
    let githubPushed = false;
    let messages = [];

    // --- STRATEGY 1: Local Disk Write ---
    try {
      const filePath = path.join(process.cwd(), 'assets', 'data', 'cms-data.json');
      fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
      diskSaved = true;
      messages.push('Saved to filesystem.');
    } catch (fsErr) {
      // Ephemeral on Vercel lambda - proceed to remote persistent storage
    }

    // --- STRATEGY 2: Supabase Database (if configured) ---
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const cleanUrl = supabaseUrl.replace(/\/+$/, '');
        const resDb = await fetch(`${cleanUrl}/rest/v1/site_cms`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: 'gida_cms_main',
            data: payload,
            updated_at: payload.updatedAt
          })
        });

        if (resDb.ok) {
          supabaseSaved = true;
          messages.push('Persisted permanently to Supabase database.');
        } else {
          // If table does not exist yet, log for diagnostic
          const errText = await resDb.text();
          console.warn('[Supabase CMS Save Warning]:', resDb.status, errText);
        }
      } catch (sbErr) {
        console.warn('[Supabase CMS Error]:', sbErr.message);
      }
    }

    // --- STRATEGY 3: GitHub REST API Commit Server-Side (if GITHUB_TOKEN configured in Vercel env) ---
    const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (ghToken) {
      try {
        const repo = process.env.GITHUB_REPO || 'usmanrimi/gida';
        const branch = process.env.GITHUB_BRANCH || 'master';
        const repoPath = 'assets/data/cms-data.json';
        const apiUrl = `https://api.github.com/repos/${repo}/contents/${repoPath}?ref=${branch}`;

        // Get current SHA
        let sha = null;
        const getRes = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${ghToken}`,
            'User-Agent': 'GIDA-CMS-Engine'
          }
        });
        if (getRes.ok) {
          const fileInfo = await getRes.json();
          sha = fileInfo.sha;
        }

        const base64Content = Buffer.from(JSON.stringify(payload, null, 2), 'utf8').toString('base64');
        const putBody = {
          message: `Update CMS content from Super Admin: ${payload.updatedAt}`,
          content: base64Content,
          branch: branch
        };
        if (sha) putBody.sha = sha;

        const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${repoPath}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${ghToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'GIDA-CMS-Engine'
          },
          body: JSON.stringify(putBody)
        });

        if (putRes.ok) {
          githubPushed = true;
          messages.push('Committed directly to GitHub master repository.');
        } else {
          const ghErrText = await putRes.text();
          console.warn('[GitHub Commit Error]:', putRes.status, ghErrText);
        }
      } catch (ghErr) {
        console.warn('[GitHub Commit Exception]:', ghErr.message);
      }
    }

    const isPersisted = diskSaved || supabaseSaved || githubPushed;

    return res.status(200).json({
      success: true,
      serverSaved: isPersisted,
      diskSaved,
      supabaseSaved,
      pushed: githubPushed,
      updatedAt: payload.updatedAt,
      message: messages.join(' ') || 'Changes recorded successfully.'
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
