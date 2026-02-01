-- =============================================
-- Phase 1: Database-Backed Inbox & Artifacts
-- =============================================

-- Table 1: inbox_items (staging area for discovered content)
CREATE TABLE public.inbox_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('orcid', 'github', 'crossref', 'openalex', 'google_scholar')),
  external_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  raw_data JSONB,
  suggested_artifact JSONB,
  notes TEXT,
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source, external_id)
);

-- Table 2: artifacts (published content for Academic/Build pages)
CREATE TABLE public.artifacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('paper', 'project', 'talk', 'role', 'award', 'certification', 'education', 'grant', 'skill')),
  title TEXT NOT NULL,
  subtitle TEXT,
  organization TEXT,
  location TEXT,
  date DATE NOT NULL,
  end_date DATE,
  summary TEXT NOT NULL,
  details JSONB DEFAULT '[]'::jsonb,
  links JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT '{}',
  mode_visibility TEXT NOT NULL DEFAULT 'both' CHECK (mode_visibility IN ('academic', 'build', 'both')),
  section TEXT CHECK (section IN ('education', 'experience', 'teaching', 'publications', 'certifications', 'skills', 'honors', 'grants')),
  collaboration_breakdown JSONB,
  source_ids JSONB DEFAULT '{}'::jsonb,
  featured BOOLEAN DEFAULT false,
  preview_image TEXT,
  preview_video TEXT,
  demo_info JSONB,
  year INTEGER,
  inbox_item_id UUID REFERENCES public.inbox_items(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.inbox_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inbox_items (admin-only via service role, no public access)
-- Edge functions use service role key which bypasses RLS

-- RLS Policies for artifacts (public read, no public write)
CREATE POLICY "Artifacts are publicly readable"
  ON public.artifacts
  FOR SELECT
  USING (true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for automatic timestamp updates on artifacts
CREATE TRIGGER update_artifacts_updated_at
  BEFORE UPDATE ON public.artifacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to approve an inbox item and create an artifact
CREATE OR REPLACE FUNCTION public.approve_inbox_item(
  p_inbox_id UUID,
  p_artifact_data JSONB
)
RETURNS UUID AS $$
DECLARE
  v_artifact_id UUID;
  v_slug TEXT;
BEGIN
  -- Generate slug from title
  v_slug := lower(regexp_replace(p_artifact_data->>'title', '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := trim(both '-' from v_slug);
  
  -- Ensure uniqueness by appending timestamp if needed
  IF EXISTS (SELECT 1 FROM public.artifacts WHERE slug = v_slug) THEN
    v_slug := v_slug || '-' || extract(epoch from now())::integer;
  END IF;

  -- Insert the artifact
  INSERT INTO public.artifacts (
    slug, type, title, subtitle, organization, location,
    date, end_date, summary, details, links, tags,
    mode_visibility, section, collaboration_breakdown,
    source_ids, featured, preview_image, demo_info, year,
    inbox_item_id
  )
  VALUES (
    v_slug,
    COALESCE(p_artifact_data->>'type', 'project'),
    p_artifact_data->>'title',
    p_artifact_data->>'subtitle',
    p_artifact_data->>'organization',
    p_artifact_data->>'location',
    COALESCE((p_artifact_data->>'date')::date, CURRENT_DATE),
    (p_artifact_data->>'end_date')::date,
    COALESCE(p_artifact_data->>'summary', ''),
    COALESCE(p_artifact_data->'details', '[]'::jsonb),
    COALESCE(p_artifact_data->'links', '{}'::jsonb),
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(p_artifact_data->'tags')), '{}'),
    COALESCE(p_artifact_data->>'mode_visibility', 'both'),
    p_artifact_data->>'section',
    p_artifact_data->'collaboration_breakdown',
    COALESCE(p_artifact_data->'source_ids', '{}'::jsonb),
    COALESCE((p_artifact_data->>'featured')::boolean, false),
    p_artifact_data->>'preview_image',
    p_artifact_data->'demo_info',
    (p_artifact_data->>'year')::integer,
    p_inbox_id
  )
  RETURNING id INTO v_artifact_id;

  -- Update inbox item status
  UPDATE public.inbox_items
  SET status = 'approved', reviewed_at = now()
  WHERE id = p_inbox_id;

  RETURN v_artifact_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create indexes for common queries
CREATE INDEX idx_inbox_items_status ON public.inbox_items(status);
CREATE INDEX idx_inbox_items_source ON public.inbox_items(source);
CREATE INDEX idx_artifacts_type ON public.artifacts(type);
CREATE INDEX idx_artifacts_mode_visibility ON public.artifacts(mode_visibility);
CREATE INDEX idx_artifacts_section ON public.artifacts(section);
CREATE INDEX idx_artifacts_featured ON public.artifacts(featured) WHERE featured = true;