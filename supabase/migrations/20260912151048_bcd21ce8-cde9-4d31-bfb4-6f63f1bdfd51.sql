CREATE TABLE public.consulting_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  decision TEXT NOT NULL,
  deadline TEXT NOT NULL,
  cost TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.consulting_inquiries TO anon, authenticated;
GRANT ALL ON public.consulting_inquiries TO service_role;

ALTER TABLE public.consulting_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an inquiry"
  ON public.consulting_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(decision) BETWEEN 1 AND 5000
    AND length(deadline) BETWEEN 1 AND 500
    AND length(cost) BETWEEN 1 AND 5000
    AND (email IS NULL OR length(email) <= 320)
    AND status = 'new'
  );

CREATE POLICY "No public read of inquiries"
  ON public.consulting_inquiries
  FOR SELECT
  USING (false);

CREATE TRIGGER update_consulting_inquiries_updated_at
  BEFORE UPDATE ON public.consulting_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_consulting_inquiries_created_at ON public.consulting_inquiries(created_at DESC);