/**
 * Serverless API: /api/upload-file
 * Handles file and image uploads for Super Admin
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

  // Verify auth token
  const authHeader = req.headers.authorization || req.headers['x-admin-token'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const session = verifySessionToken(token);
  const isLocalHost = req.headers.host && (req.headers.host.includes('localhost') || req.headers.host.includes('127.0.0.1'));

  if (!session && !isLocalHost) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const payload = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const rawName = payload.filename || 'file_' + Date.now();
    const cleanName = rawName.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    const isImage = /\.(png|jpg|jpeg|webp|svg|gif)$/i.test(cleanName);

    let base64Data = payload.data || '';
    if (base64Data.includes(',')) {
      base64Data = base64Data.split(',')[1];
    }
    const fileBuffer = Buffer.from(base64Data, 'base64');

    // 1. Try local filesystem write (local dev / writable container)
    try {
      const subDir = isImage ? path.join('assets', 'img') : path.join('assets', 'docs');
      const targetDir = path.join(process.cwd(), subDir);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetPath = path.join(targetDir, cleanName);
      fs.writeFileSync(targetPath, fileBuffer);

      return res.status(200).json({
        success: true,
        filePath: `${subDir.replace(/\\/g, '/')}/${cleanName}`,
        filename: cleanName
      });
    } catch (fsErr) {
      // Ephemeral serverless runtime
    }

    // 2. Try GitHub commit if GITHUB_TOKEN configured
    const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (ghToken) {
      try {
        const repo = process.env.GITHUB_REPO || 'usmanrimi/gida';
        const branch = process.env.GITHUB_BRANCH || 'master';
        const repoPath = `${isImage ? 'assets/img' : 'assets/docs'}/${cleanName}`;

        const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${repoPath}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${ghToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'GIDA-CMS-Engine'
          },
          body: JSON.stringify({
            message: `Upload media from Super Admin: ${cleanName}`,
            content: fileBuffer.toString('base64'),
            branch: branch
          })
        });

        if (putRes.ok) {
          return res.status(200).json({
            success: true,
            filePath: `${isImage ? 'assets/img' : 'assets/docs'}/${cleanName}`,
            filename: cleanName
          });
        }
      } catch (ghErr) {
        console.warn('[GitHub file upload error]:', ghErr.message);
      }
    }

    // 3. Fallback: Return data URL so image works seamlessly inside rich-text or CMS
    const mime = isImage
      ? (cleanName.endsWith('.png') ? 'image/png' : cleanName.endsWith('.webp') ? 'image/webp' : 'image/jpeg')
      : 'application/pdf';
    const dataUrl = `data:${mime};base64,${base64Data}`;

    return res.status(200).json({
      success: true,
      filePath: dataUrl,
      filename: cleanName
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
