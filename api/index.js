let app;
let initError = null;

try {
  app = require('../server/server');
} catch (e) {
  initError = {
    message: e.message,
    stack: e.stack,
    name: e.name,
    code: e.code
  };
}

module.exports = (req, res) => {
  if (initError) {
    return res.status(500).json({
      success: false,
      error: 'Module initialization failed',
      details: initError
    });
  }

  try {
    const matchedPath = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'];
    if (matchedPath && !matchedPath.endsWith('/api/index.js') && !matchedPath.endsWith('/api/index')) {
      const urlParts = (req.url || '').split('?');
      const query = urlParts[1] ? `?${urlParts[1]}` : '';
      req.url = matchedPath + query;
    }
    return app(req, res);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Request handling error',
      message: err.message,
      stack: err.stack
    });
  }
};
