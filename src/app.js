require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');

const { applySecurityMiddlewares } = require('./middlewares/security');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const apiDocs = require('./docs/openapi.json');

const app = express();

// Middlewares globais de segurança e parsing
applySecurityMiddlewares(app);

// Documentação da API (Swagger UI)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiDocs));

// Rotas
app.use('/auth', authRoutes);
app.use('/order', orderRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler central
app.use(errorHandler);

module.exports = app;

