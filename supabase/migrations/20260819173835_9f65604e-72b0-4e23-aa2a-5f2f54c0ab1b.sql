REVOKE ALL ON TABLE public.artifacts FROM anon, authenticated;
REVOKE ALL ON TABLE public.inbox_items FROM anon, authenticated;
GRANT SELECT ON TABLE public.artifacts TO anon, authenticated;
GRANT ALL ON TABLE public.artifacts TO service_role;
GRANT ALL ON TABLE public.inbox_items TO service_role;