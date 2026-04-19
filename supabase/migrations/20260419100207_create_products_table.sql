-- Создание таблицы products для хранения каталогов товаров
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  catalog JSONB NOT NULL, -- Содержит campaign и products
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Отключить RLS для простоты (в продакшене включить и настроить политики)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Индекс для поиска по campaign.number
CREATE INDEX idx_products_campaign_number ON products ((catalog->'campaign'->>'number'));

-- Индекс для поиска по product.id
CREATE INDEX idx_products_product_id ON products USING GIN ((catalog->'products'));

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();