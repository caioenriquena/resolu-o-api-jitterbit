function notFoundHandler(req, res, next) {
  return res.status(404).json({
    mensagem: 'Rota não encontrada.',
  });
}

function mapStatusCode(err) {
  if (err.statusCode || err.status) {
    return err.statusCode || err.status;
  }

  if (err.isJoi) {
    return 400;
  }

  if (err.code === '23505') {
    return 409;
  }

  return 500;
}

function buildClientMessage(err, status) {
  if (err.isJoi) {
    return 'Dados de entrada inválidos.';
  }

  if (status === 409) {
    return 'Recurso em conflito ou já existente.';
  }

  if (status === 404) {
    return 'Recurso não encontrado.';
  }

  if (status === 400) {
    return 'Requisição inválida.';
  }

  if (status === 500) {
    return 'Erro interno do servidor.';
  }

  return err.message || 'Erro ao processar a requisição.';
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = mapStatusCode(err);
  const isProd = process.env.NODE_ENV === 'production';

  if (status >= 500) {
    // Log mais detalhado apenas no servidor
    // eslint-disable-next-line no-console
    console.error('Erro inesperado:', err);
  } else {
    // eslint-disable-next-line no-console
    console.warn('Erro tratado:', err.message);
  }

  const payload = {
    mensagem: buildClientMessage(err, status),
  };

  if (err.isJoi && err.details && !isProd) {
    payload.detalhes = err.details.map((detail) => detail.message);
  }

  return res.status(status).json(payload);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};

