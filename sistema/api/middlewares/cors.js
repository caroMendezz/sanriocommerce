const env = require('../config/env');

const cors = (req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || origin === env.clientOrigin) {
    res.header('Access-Control-Allow-Origin', origin || env.clientOrigin);
    res.header('Vary', 'Origin');
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
};

module.exports = cors;
