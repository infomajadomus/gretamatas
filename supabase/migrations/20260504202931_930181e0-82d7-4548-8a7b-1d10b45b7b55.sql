DROP POLICY "Anyone can submit RSVP" ON public.rsvps;

CREATE POLICY "Anyone can submit RSVP"
  ON public.rsvps FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(first_name) BETWEEN 1 AND 80
    AND char_length(last_name) BETWEEN 1 AND 80
    AND (partner_first_name IS NULL OR char_length(partner_first_name) <= 80)
    AND (partner_last_name IS NULL OR char_length(partner_last_name) <= 80)
    AND (meal_choice IS NULL OR char_length(meal_choice) <= 40)
    AND (partner_meal_choice IS NULL OR char_length(partner_meal_choice) <= 40)
    AND (dietary_notes IS NULL OR char_length(dietary_notes) <= 500)
    AND (message IS NULL OR char_length(message) <= 1000)
    AND (invite_slug IS NULL OR char_length(invite_slug) <= 80)
  );