const app = require('../server/server');

module.exports = (req, res) => {
  try {
    // On Vercel, URL rewrites may set req.url to /api/index.js.
    // Restore the original request path from x-matched-path if present.
    const matchedPath = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'];
    if (matchedPath && !matchedPath.endsWith('/api/index.js') && !matchedPath.endsWith('/api/index')) {
      const urlParts = (req.url || '').split('?');
      const query = urlParts[1] ? `?${urlParts[1]}` : '';
      req.url = matchedPath + query;
    }
    return app(req, res);
  } catch (err) {
    console.error('[Vercel Serverless Function Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message
    });
  }
};
