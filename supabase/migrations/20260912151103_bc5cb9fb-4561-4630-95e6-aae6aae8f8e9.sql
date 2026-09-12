REVOKE SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public.consulting_inquiries FROM anon, authenticated;
GRANT INSERT ON TABLE public.consulting_inquiries TO anon, authenticated;