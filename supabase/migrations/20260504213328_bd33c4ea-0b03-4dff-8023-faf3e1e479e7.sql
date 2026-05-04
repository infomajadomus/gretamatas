-- Guests table for personalized invite links
CREATE TABLE public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  greeting text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Public read so the website can resolve ?kam=slug into a greeting
CREATE POLICY "Anyone can read guests" ON public.guests FOR SELECT USING (true);

-- Writes happen only via server functions using the service role (bypasses RLS),
-- so no insert/update/delete policies are added here.

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER guests_touch_updated_at
BEFORE UPDATE ON public.guests
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();