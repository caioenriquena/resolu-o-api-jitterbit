const jwt = require('jsonwebtoken');

// Espera header: Authorization: Bearer <token>
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (!token || scheme !== 'Bearer') {
    return res.status(401).json({
      mensagem: 'Token de autenticação não fornecido ou mal formatado.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'changeme';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      mensagem: 'Token inválido ou expirado.',
    });
  }
}

module.exports = {
  authMiddleware,
};

