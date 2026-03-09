const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  // Log simples para ambiente de desenvolvimento
  console.log(`Servidor ouvindo na porta ${PORT}`);
});

