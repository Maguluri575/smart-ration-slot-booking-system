// Vercel Serverless Function entry point
let app = null;
let initError = null;

try {
  app = require('../backend/server');
} catch (err) {
  initError = err;
  console.error("FATAL: Failed to load backend/server in Vercel:", err);
}

module.exports = (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  // Health and Diagnostic Endpoint
  if (req.url === '/api/health' || req.url === '/api/health/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      status: 'ok',
      initError: initError ? { message: initError.message, stack: initError.stack } : null,
      env: {
        hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
        hasSupabaseKey: Boolean(process.env.SUPABASE_KEY),
        hasJwtSecret: Boolean(process.env.JWT_SECRET),
        isVercel: Boolean(process.env.VERCEL),
        nodeEnv: process.env.NODE_ENV
      }
    }));
  }

  // If there was an initialization failure, return clean JSON instead of crashing
  if (initError) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      error: "Backend initialization failed on Vercel",
      details: initError.message,
      stack: initError.stack
    }));
  }

  // Delegate to Express app
  try {
    return app(req, res);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      error: "Runtime execution error in Express",
      details: err.message,
      stack: err.stack
    }));
  }
};
