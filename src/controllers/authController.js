const { login } = require('../services/authService');

async function loginHandler(req, res, next) {
  try {
    const result = await login(req.body);

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  loginHandler,
};

