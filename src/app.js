require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');

const { applySecurityMiddlewares } = require('./middlewares/security');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const apiDocs = require('./docs/openapi.json');

const app = express();

// CORS, helmet, rate limit, body parser (tudo em security.js)
applySecurityMiddlewares(app);

// Swagger em /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiDocs));

app.use('/auth', authRoutes);
app.use('/order', orderRoutes);

// Ordem importa: rotas primeiro, depois 404 e por último o error handler
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

