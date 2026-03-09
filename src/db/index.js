const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'orders_db',
  user: process.env.DB_USER || 'order_user',
  password: process.env.DB_PASSWORD || 'order_password',
});

pool.on('error', (err) => {
  // Log simples para ajudar a diagnosticar problemas de conexão
  console.error('Erro inesperado no pool de conexões do PostgreSQL', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};

