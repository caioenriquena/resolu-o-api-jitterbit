const db = require('../db');

// Transação: pedido + itens inseridos juntos, rollback se algo falhar
async function createOrderWithItems(order, items) {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const insertOrderText = `
      INSERT INTO orders (order_id, value, creation_date)
      VALUES ($1, $2, $3)
    `;

    await client.query(insertOrderText, [
      order.orderId,
      order.value,
      order.creationDate,
    ]);

    // Insert em batch dos itens (um VALUES com vários placeholders)
    if (items && items.length > 0) {
      const values = [];
      const placeholders = [];

      items.forEach((item, index) => {
        const baseIndex = index * 4;
        placeholders.push(
          `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`,
        );
        values.push(order.orderId, item.productId, item.quantity, item.price);
      });

      const insertItemsText = `
        INSERT INTO items (order_id, product_id, quantity, price)
        VALUES ${placeholders.join(', ')}
      `;

      await client.query(insertItemsText, values);
    }

    await client.query('COMMIT');

    return {
      orderId: order.orderId,
      value: order.value,
      creationDate: order.creationDate,
      items: items || [],
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Retorna null se não existir; monta o objeto order com array de items
async function findOrderWithItemsById(orderId) {
  const queryText = `
    SELECT
      o.order_id,
      o.value,
      o.creation_date,
      i.id AS item_id,
      i.product_id,
      i.quantity,
      i.price
    FROM orders o
    LEFT JOIN items i ON i.order_id = o.order_id
    WHERE o.order_id = $1
    ORDER BY i.id
  `;

  const result = await db.query(queryText, [orderId]);

  if (result.rows.length === 0) {
    return null;
  }

  const [firstRow] = result.rows;

  const order = {
    orderId: firstRow.order_id,
    value: Number(firstRow.value),
    creationDate: firstRow.creation_date,
    items: [],
  };

  for (const row of result.rows) {
    if (!row.item_id) {
      continue;
    }

    order.items.push({
      id: row.item_id,
      productId: row.product_id,
      quantity: row.quantity,
      price: Number(row.price),
    });
  }

  return order;
}

// Paginação: sanitiza page/limit e usa LIMIT/OFFSET
async function listOrdersWithItems({ page = 1, limit = 20 } = {}) {
  const safePage = Number.isNaN(Number(page)) || page < 1 ? 1 : Number(page);
  const safeLimit =
    Number.isNaN(Number(limit)) || limit < 1 || limit > 100 ? 20 : Number(limit);

  const offset = (safePage - 1) * safeLimit;

  const queryText = `
    SELECT
      o.order_id,
      o.value,
      o.creation_date,
      i.id AS item_id,
      i.product_id,
      i.quantity,
      i.price
    FROM orders o
    LEFT JOIN items i ON i.order_id = o.order_id
    ORDER BY o.creation_date DESC, o.order_id, i.id
    LIMIT $1 OFFSET $2
  `;

  const result = await db.query(queryText, [safeLimit, offset]);

  // Uma linha por item (JOIN); agrupa por order_id no Map
  const ordersMap = new Map();

  for (const row of result.rows) {
    let order = ordersMap.get(row.order_id);

    if (!order) {
      order = {
        orderId: row.order_id,
        value: Number(row.value),
        creationDate: row.creation_date,
        items: [],
      };

      ordersMap.set(row.order_id, order);
    }

    if (row.item_id) {
      order.items.push({
        id: row.item_id,
        productId: row.product_id,
        quantity: row.quantity,
        price: Number(row.price),
      });
    }
  }

  return Array.from(ordersMap.values());
}

// Atualiza cabeçalho do pedido e recria os itens (delete + insert)
async function updateOrderWithItems(orderId, order, items) {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const updateOrderText = `
      UPDATE orders
      SET value = $1,
          creation_date = $2
      WHERE order_id = $3
    `;

    const updateResult = await client.query(updateOrderText, [
      order.value,
      order.creationDate,
      orderId,
    ]);

    if (updateResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return null; // pedido não existe
    }

    await client.query('DELETE FROM items WHERE order_id = $1', [orderId]);

    if (items && items.length > 0) {
      const values = [];
      const placeholders = [];

      items.forEach((item, index) => {
        const baseIndex = index * 4;
        placeholders.push(
          `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`,
        );
        values.push(orderId, item.productId, item.quantity, item.price);
      });

      const insertItemsText = `
        INSERT INTO items (order_id, product_id, quantity, price)
        VALUES ${placeholders.join(', ')}
      `;

      await client.query(insertItemsText, values);
    }

    await client.query('COMMIT');

    return {
      orderId,
      value: order.value,
      creationDate: order.creationDate,
      items: items || [],
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// FK em items tem ON DELETE CASCADE, então itens somem junto
async function deleteOrder(orderId) {
  const deleteText = 'DELETE FROM orders WHERE order_id = $1';
  const result = await db.query(deleteText, [orderId]);
  return result.rowCount > 0;
}

module.exports = {
  createOrderWithItems,
  findOrderWithItemsById,
  listOrdersWithItems,
  updateOrderWithItems,
  deleteOrder,
};

