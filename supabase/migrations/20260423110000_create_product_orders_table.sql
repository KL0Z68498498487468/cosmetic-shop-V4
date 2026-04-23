-- Таблица для отслеживания Telegram-заказов по каждому товару
-- Каждая строка = один успешный Telegram-заказ
CREATE TABLE IF NOT EXISTS product_orders (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для быстрой выборки по товару и дате
CREATE INDEX IF NOT EXISTS idx_product_orders_product_id ON product_orders (product_id);
CREATE INDEX IF NOT EXISTS idx_product_orders_created_at ON product_orders (created_at);

-- Отключить RLS (в продакшене добавить политики)
ALTER TABLE product_orders DISABLE ROW LEVEL SECURITY;
