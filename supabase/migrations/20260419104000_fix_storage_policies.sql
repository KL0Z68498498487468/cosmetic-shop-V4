-- Fix storage bucket policies for product images
-- Create policies for the product-images bucket

-- First, ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the product-images bucket
-- Allow all operations for authenticated users (for admin panel)
CREATE POLICY "Allow all operations on product-images" ON storage.objects
FOR ALL USING (bucket_id = 'product-images');

-- Alternative: Allow public access for reading, authenticated for writing
-- DROP POLICY IF EXISTS "Public read access for product-images" ON storage.objects;
-- CREATE POLICY "Public read access for product-images" ON storage.objects
-- FOR SELECT USING (bucket_id = 'product-images');

-- DROP POLICY IF EXISTS "Authenticated users can upload to product-images" ON storage.objects;
-- CREATE POLICY "Authenticated users can upload to product-images" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- DROP POLICY IF EXISTS "Authenticated users can update product-images" ON storage.objects;
-- CREATE POLICY "Authenticated users can update product-images" ON storage.objects
-- FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- DROP POLICY IF EXISTS "Authenticated users can delete from product-images" ON storage.objects;
-- CREATE POLICY "Authenticated users can delete from product-images" ON storage.objects
-- FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');