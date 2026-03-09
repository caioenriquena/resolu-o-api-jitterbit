require('dotenv').config();

const express = require('express');

const { applySecurityMiddlewares } = require('./middlewares/security');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares globais de segurança e parsing
applySecurityMiddlewares(app);

// Rotas
app.use('/auth', authRoutes);
app.use('/order', orderRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler central
app.use(errorHandler);

module.exports = app;

