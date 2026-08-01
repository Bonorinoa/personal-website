-- Lock down the SECURITY DEFINER approval function to server-side (service_role) use only
REVOKE ALL ON FUNCTION public.approve_inbox_item(uuid, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.approve_inbox_item(uuid, jsonb) FROM anon;
REVOKE ALL ON FUNCTION public.approve_inbox_item(uuid, jsonb) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.approve_inbox_item(uuid, jsonb) TO service_role;

-- Remove inbox staging table exposure from the public/authenticated API surface
REVOKE ALL ON TABLE public.inbox_items FROM anon;
REVOKE ALL ON TABLE public.inbox_items FROM authenticated;
GRANT ALL ON TABLE public.inbox_items TO service_role;

-- Public portfolio content stays readable, but writes stay server-side only
REVOKE INSERT, UPDATE, DELETE ON TABLE public.artifacts FROM anon;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.artifacts FROM authenticated;
GRANT SELECT ON TABLE public.artifacts TO anon;
GRANT SELECT ON TABLE public.artifacts TO authenticated;
GRANT ALL ON TABLE public.artifacts TO service_role;