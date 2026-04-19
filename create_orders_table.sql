-- Создание таблицы orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  delivery TEXT NOT NULL,
  payment TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Отключить RLS для простоты (в продакшене включить и настроить политики)
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Или включить и добавить политики:
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow insert for anonymous" ON orders FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow select for authenticated admin" ON orders FOR SELECT USING (auth.role() = 'authenticated');