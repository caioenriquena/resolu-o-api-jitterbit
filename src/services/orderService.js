const {
  createOrderWithItems,
  findOrderWithItemsById,
  listOrdersWithItems,
  updateOrderWithItems,
  deleteOrder,
} = require('../repositories/orderRepository');

// Converte o formato da API (numeroPedido, valorTotal, etc.) pro formato usado no repositório/banco
function mapPayloadToDomain(payload) {
  const {
    numeroPedido,
    valorTotal,
    dataCriacao,
    items = [],
  } = payload || {};

  const orderId = numeroPedido;

  const order = {
    orderId,
    value: valorTotal,
    creationDate: dataCriacao ? new Date(dataCriacao) : new Date(),
  };

  const domainItems = items.map((item) => ({
    productId: item.idItem,
    quantity: item.quantidadeItem,
    price: item.valorItem,
  }));

  return { order, items: domainItems };
}

// Converte de volta pro formato que a API expõe (mesmo contrato do request)
function mapDomainToResponse(order) {
  if (!order) {
    return null;
  }

  return {
    numeroPedido: order.orderId,
    valorTotal: Number(order.value),
    dataCriacao:
      order.creationDate instanceof Date
        ? order.creationDate.toISOString()
        : new Date(order.creationDate).toISOString(),
    items: (order.items || []).map((item) => ({
      idItem: item.productId,
      quantidadeItem: item.quantity,
      valorItem: Number(item.price),
    })),
  };
}

async function createOrder(payload) {
  const { order, items } = mapPayloadToDomain(payload);
  const created = await createOrderWithItems(order, items);
  return mapDomainToResponse(created);
}

async function getOrderByNumeroPedido(numeroPedido) {
  const order = await findOrderWithItemsById(numeroPedido);

  return mapDomainToResponse(order);
}

async function listOrders(options = {}) {
  const { page = 1, limit = 20 } = options;

  const orders = await listOrdersWithItems({ page, limit });

  return {
    page: Number(page),
    limit: Number(limit),
    data: orders.map(mapDomainToResponse),
  };
}

async function updateOrder(numeroPedido, payload) {
  const { order, items } = mapPayloadToDomain({
    ...payload,
    numeroPedido,
  });

  const updated = await updateOrderWithItems(numeroPedido, order, items);

  if (!updated) {
    return null;
  }

  return mapDomainToResponse(updated);
}

async function deleteOrderByNumeroPedido(numeroPedido) {
  const deleted = await deleteOrder(numeroPedido);

  return deleted;
}

module.exports = {
  createOrder,
  getOrderByNumeroPedido,
  listOrders,
  updateOrder,
  deleteOrderByNumeroPedido,
};

