const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

function buildCorsOptions() {
  const rawOrigins =
    process.env.CORS_ORIGINS ||
    process.env.CORS_ORIGIN ||
    process.env.ALLOWED_ORIGINS;

  if (!rawOrigins) {
    return {};
  }

  const origins = rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    return {};
  }

  return {
    origin: origins,
  };
}

function applySecurityMiddlewares(app) {
  app.disable('x-powered-by');

  const jsonLimit = process.env.JSON_BODY_LIMIT || '1mb';
  app.use(express.json({ limit: jsonLimit }));

  app.use(helmet());

  app.use(cors(buildCorsOptions()));

  const windowMsEnv = Number(process.env.RATE_LIMIT_WINDOW_MS);
  const maxEnv = Number(process.env.RATE_LIMIT_MAX);

  const apiLimiter = rateLimit({
    windowMs: !Number.isNaN(windowMsEnv) && windowMsEnv > 0 ? windowMsEnv : 15 * 60 * 1000,
    max: !Number.isNaN(maxEnv) && maxEnv > 0 ? maxEnv : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      mensagem: 'Muitas requisições a partir deste IP. Tente novamente mais tarde.',
    },
  });

  app.use(apiLimiter);
}

module.exports = {
  applySecurityMiddlewares,
};

