/**
 * Serverless API: /api/get-cms
 * Serves canonical CMS data directly with cache-busting headers
 */
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
