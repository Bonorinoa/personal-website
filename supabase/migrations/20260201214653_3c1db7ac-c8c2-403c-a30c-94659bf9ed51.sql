-- inbox_items is admin-only (accessed via service role which bypasses RLS)
-- Adding explicit policies that deny public access to satisfy linter

-- Deny all public access to inbox_items
CREATE POLICY "No public access to inbox_items"
  ON public.inbox_items
  FOR ALL
  USING (false)
  WITH CHECK (false);