/**
 * Serverless API: /api/get-cms
 * Serves canonical, authoritative CMS data with zero caching
 */
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Try Supabase if configured
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const cleanUrl = supabaseUrl.replace(/\/+$/, '');
      const dbRes = await fetch(`${cleanUrl}/rest/v1/site_cms?id=eq.gida_cms_main&select=data,updated_at`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept': 'application/json'
        }
      });
      if (dbRes.ok) {
        const rows = await dbRes.json();
        if (rows && rows.length > 0 && rows[0].data) {
          const cmsData = rows[0].data;
          if (rows[0].updated_at) cmsData.updatedAt = rows[0].updated_at;
          return res.status(200).json(cmsData);
        }
      }
    } catch (sbErr) {
      console.warn('[Get-CMS Supabase warning]:', sbErr.message);
    }
  }

  // 2. Read from filesystem
  try {
    const filePath = path.join(process.cwd(), 'assets', 'data', 'cms-data.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return res.status(200).send(content);
    }
    return res.status(404).json({ success: false, error: 'cms-data.json not found' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
