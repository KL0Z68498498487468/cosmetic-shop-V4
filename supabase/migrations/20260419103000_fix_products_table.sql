-- Ensure products table has correct structure
-- Add catalog column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'products' AND column_name = 'catalog') THEN
        ALTER TABLE products ADD COLUMN catalog JSONB;
    END IF;
END $$;

-- Make sure catalog column is NOT NULL
ALTER TABLE products ALTER COLUMN catalog SET NOT NULL;

-- Disable RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;