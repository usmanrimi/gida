/**
 * Serverless API: /api/save-cms
 * Persists CMS updates either via filesystem (if writable) or via GitHub REST API
 */
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const payload = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    payload.updatedAt = new Date().toISOString();

    let diskSaved = false;
    const filePath = path.join(process.cwd(), 'assets', 'data', 'cms-data.json');

    try {
      fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
      diskSaved = true;
    } catch (fsErr) {
      // Expected on read-only serverless runtimes
    }

    // If GitHub Token is configured in environment, commit directly to GitHub repository
    const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    let githubPushed = false;
    let ghMessage = '';

    if (ghToken) {
      try {
        const repo = 'usmanrimi/gida';
        const branch = 'master';
        const repoPath = 'assets/data/cms-data.json';
        const apiUrl = `https://api.github.com/repos/${repo}/contents/${repoPath}?ref=${branch}`;

        // Get current SHA
        let sha = null;
        const getRes = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${ghToken}`
          }
        });
        if (getRes.ok) {
          const fileInfo = await getRes.json();
          sha = fileInfo.sha;
        }

        const base64Content = Buffer.from(JSON.stringify(payload, null, 2)).toString('base64');
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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(putBody)
        });

        if (putRes.ok) {
          githubPushed = true;
          ghMessage = 'Committed to GitHub master repository.';
        }
      } catch (ghErr) {
        ghMessage = 'GitHub commit attempt error: ' + ghErr.message;
      }
    }

    return res.status(200).json({
      success: true,
      serverSaved: diskSaved || githubPushed,
      pushed: githubPushed,
      updatedAt: payload.updatedAt,
      message: githubPushed
        ? 'Changes successfully saved and committed to live GitHub repository!'
        : (diskSaved
          ? 'Changes saved to disk.'
          : 'Changes recorded. Please push to GitHub using Super Admin.')
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
