-- Create orders table for storing customer orders
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  shipping_address jsonb,
  payment_method text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your auth system)
-- For now, allow all operations (you should restrict this in production)
CREATE POLICY "Allow all operations on orders" ON public.orders
  FOR ALL USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.orders_set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.orders_set_updated_at();