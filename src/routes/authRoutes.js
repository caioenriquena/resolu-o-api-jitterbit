const express = require('express');

const { loginHandler } = require('../controllers/authController');
const { validateLogin } = require('../validation/authValidation');

const router = express.Router();

// POST /auth/login
router.post('/login', validateLogin, loginHandler);

module.exports = router;

