-- Create table for storing product reviews
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Аноним',
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE product_reviews DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
