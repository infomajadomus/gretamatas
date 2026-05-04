CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_slug TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  is_couple BOOLEAN NOT NULL DEFAULT false,
  partner_first_name TEXT,
  partner_last_name TEXT,
  meal_choice TEXT,
  partner_meal_choice TEXT,
  dietary_notes TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit RSVP"
  ON public.rsvps FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can read RSVPs"
  ON public.rsvps FOR SELECT
  TO authenticated
  USING (true);
