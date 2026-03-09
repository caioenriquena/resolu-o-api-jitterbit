const express = require('express');

const {
  createOrderHandler,
  getOrderHandler,
  listOrdersHandler,
  updateOrderHandler,
  deleteOrderHandler,
} = require('../controllers/orderController');
const {
  validateCreateOrder,
  validateUpdateOrder,
  validateListOrdersQuery,
} = require('../validation/orderValidation');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Criar pedido: exige token + body validado
router.post('/', authMiddleware, validateCreateOrder, createOrderHandler);

// Listar com paginação (page, limit na query)
router.get('/list', validateListOrdersQuery, listOrdersHandler);

// Busca por número do pedido (rota sem auth)
router.get('/:numeroPedido', getOrderHandler);

// Atualizar e deletar exigem auth
router.put('/:numeroPedido', authMiddleware, validateUpdateOrder, updateOrderHandler);
router.delete('/:numeroPedido', authMiddleware, deleteOrderHandler);

module.exports = router;

