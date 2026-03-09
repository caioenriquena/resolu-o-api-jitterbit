const express = require('express');

const {
  createOrderHandler,
  getOrderHandler,
  listOrdersHandler,
  updateOrderHandler,
  deleteOrderHandler,
} = require('../controllers/orderController');

const router = express.Router();

// POST /order
router.post('/', createOrderHandler);

// GET /order/list
router.get('/list', listOrdersHandler);

// GET /order/:numeroPedido
router.get('/:numeroPedido', getOrderHandler);

// PUT /order/:numeroPedido
router.put('/:numeroPedido', updateOrderHandler);

// DELETE /order/:numeroPedido
router.delete('/:numeroPedido', deleteOrderHandler);

module.exports = router;

