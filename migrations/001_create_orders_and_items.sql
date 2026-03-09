-- Pedidos: order_id é o numeroPedido que vem da API (texto pra suportar formatos externos)
CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  value NUMERIC(12, 2) NOT NULL CHECK (value >= 0),
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Itens: product_id = idItem; ao apagar o pedido os itens vão junto (CASCADE)
CREATE TABLE IF NOT EXISTS items (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  CONSTRAINT fk_items_orders
    FOREIGN KEY (order_id)
    REFERENCES orders (order_id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_items_order_id ON items (order_id);
CREATE INDEX IF NOT EXISTS idx_items_product_id ON items (product_id);

