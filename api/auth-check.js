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
    if (!payload.exp || Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Auth-Token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'] || '';
  let token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : authHeader.trim();

  if (!token && req.body) {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e) { body = {}; }
    }
    token = body.token || '';
  }

  const session = verifySessionToken(token);
  if (!session) {
    return res.status(401).json({
      authenticated: false,
      message: 'Session invalid or expired.'
    });
  }

  return res.status(200).json({
    authenticated: true,
    user: session.sub,
    expiresAt: session.exp
  });
};
