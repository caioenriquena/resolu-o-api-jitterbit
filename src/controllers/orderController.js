const {
  createOrder,
  getOrderByNumeroPedido,
  listOrders,
  updateOrder,
  deleteOrderByNumeroPedido,
} = require('../services/orderService');

// Body já validado pelo validateCreateOrder
async function createOrderHandler(req, res, next) {
  try {
    const created = await createOrder(req.body);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

async function getOrderHandler(req, res, next) {
  try {
    const { numeroPedido } = req.params;
    const order = await getOrderByNumeroPedido(numeroPedido);
    if (!order) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado.' });
    }
    return res.status(200).json(order);
  } catch (err) {
    return next(err);
  }
}

// Query params validados por validateListOrdersQuery
async function listOrdersHandler(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = await listOrders({ page, limit });
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

async function updateOrderHandler(req, res, next) {
  try {
    const { numeroPedido } = req.params;
    const updated = await updateOrder(numeroPedido, req.body);
    if (!updated) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado.' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
}

// 204 sem body é o padrão pra delete ok
async function deleteOrderHandler(req, res, next) {
  try {
    const { numeroPedido } = req.params;
    const deleted = await deleteOrderByNumeroPedido(numeroPedido);
    if (!deleted) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado.' });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createOrderHandler,
  getOrderHandler,
  listOrdersHandler,
  updateOrderHandler,
  deleteOrderHandler,
};

