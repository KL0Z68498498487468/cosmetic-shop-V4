-- Recreate products table with correct structure
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  catalog JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_products_campaign_number ON products ((catalog->'campaign'->>'number'));
CREATE INDEX idx_products_product_id ON products USING GIN ((catalog->'products'));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();