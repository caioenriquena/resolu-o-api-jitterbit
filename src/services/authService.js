const jwt = require('jsonwebtoken');

function getAuthConfig() {
  const username = process.env.AUTH_USERNAME || 'admin';
  const password = process.env.AUTH_PASSWORD || 'admin123';
  const secret = process.env.JWT_SECRET || 'changeme';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  return {
    username,
    password,
    secret,
    expiresIn,
  };
}

async function login(credentials) {
  const { username, password } = credentials || {};
  const { username: expectedUsername, password: expectedPassword, secret, expiresIn } =
    getAuthConfig();

  if (!username || !password) {
    const error = new Error('Credenciais de autenticação são obrigatórias.');
    error.statusCode = 400;
    throw error;
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    const error = new Error('Credenciais inválidas.');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      sub: username,
    },
    secret,
    {
      expiresIn,
    },
  );

  return {
    token,
    tipo: 'Bearer',
  };
}

module.exports = {
  login,
};

