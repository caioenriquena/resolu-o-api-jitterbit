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

// POST /order
router.post('/', authMiddleware, validateCreateOrder, createOrderHandler);

// GET /order/list
router.get('/list', validateListOrdersQuery, listOrdersHandler);

// GET /order/:numeroPedido
router.get('/:numeroPedido', getOrderHandler);

// PUT /order/:numeroPedido
router.put('/:numeroPedido', authMiddleware, validateUpdateOrder, updateOrderHandler);

// DELETE /order/:numeroPedido
router.delete('/:numeroPedido', authMiddleware, deleteOrderHandler);

module.exports = router;

