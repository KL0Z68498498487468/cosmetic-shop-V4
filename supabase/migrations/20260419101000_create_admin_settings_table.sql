-- Create admin_settings table for campaign defaults used by admin panel
DROP TABLE IF EXISTS public.admin_settings;

CREATE TABLE public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_number text NOT NULL DEFAULT '01',
  campaign_year integer NOT NULL DEFAULT extract(year from now())::int,
  campaign_country text NOT NULL DEFAULT 'UZ',
  campaign_currency text NOT NULL DEFAULT 'UZS',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.admin_settings_set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW EXECUTE FUNCTION public.admin_settings_set_updated_at();

INSERT INTO public.admin_settings (campaign_number, campaign_year, campaign_country, campaign_currency)
VALUES ('01', extract(year from now())::int, 'UZ', 'UZS');
