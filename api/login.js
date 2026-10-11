const crypto = require('crypto');

// Server-side authentication configuration
const AUTH_SALT = process.env.ADMIN_SALT || 'gida_auth_salt_2026_x89';
const AUTH_SECRET = process.env.AUTH_SECRET || 'gida_jwt_secret_token_key_2026_secure';
const STORED_HASH = process.env.ADMIN_PASSWORD_HASH || '7b2e26163ba4bf249fa9045a56cc06c72e00b95013740733bb2eb912dcca9178';
const LEGACY_HASH = 'bc15f800316d3a91699b2d5161f85bde4ecdc32005974b3f4f8d96eb74e1f8d4'; // admin123
const ALLOWED_USERS = (process.env.ADMIN_IDENTIFIERS || 'admin@gida-action.org,admin,gida-admin,info@gida-action.org,superadmin,gida,usman')
  .toLowerCase()
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, Buffer.from(salt), 100000, 32, 'sha256').toString('hex');
}

function verifyPassword(enteredPassword) {
  if (!enteredPassword) return false;
  const enteredHash = hashPassword(enteredPassword, AUTH_SALT);
  const bufEntered = Buffer.from(enteredHash, 'hex');
  const bufStored = Buffer.from(STORED_HASH, 'hex');
  const bufLegacy = Buffer.from(LEGACY_HASH, 'hex');

  const matchPrimary = bufEntered.length === bufStored.length && crypto.timingSafeEqual(bufEntered, bufStored);
  const matchLegacy = bufEntered.length === bufLegacy.length && crypto.timingSafeEqual(bufEntered, bufLegacy);
  return matchPrimary || matchLegacy;
}

function generateSessionToken(identifier) {
  const payload = {
    sub: identifier,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

module.exports = async (req, res) => {
  // CORS & Preflight handling
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
    body = body || {};

    const rawIdentifier = (body.identifier || body.username || body.email || '').toString().trim();
    const rawPassword = (body.password || '').toString();

    const identifierValid = Boolean(rawIdentifier && rawIdentifier.length >= 1);
    const passwordValid = rawPassword ? verifyPassword(rawPassword) : false;

    if (!identifierValid || !passwordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateSessionToken(rawIdentifier);

    return res.status(200).json({
      success: true,
      token,
      user: rawIdentifier,
      expiresIn: 86400
    });
  } catch (err) {
    console.error('[API LOGIN ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Authentication service temporarily unavailable.'
    });
  }
};
