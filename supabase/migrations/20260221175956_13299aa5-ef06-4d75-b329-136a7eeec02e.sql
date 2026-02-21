
-- Add profile_image_url and short_description to impact_stories
ALTER TABLE public.impact_stories 
  ADD COLUMN IF NOT EXISTS profile_image_url text,
  ADD COLUMN IF NOT EXISTS short_description text NOT NULL DEFAULT '';

-- Create story_gallery table for person-specific gallery images
CREATE TABLE public.story_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES public.impact_stories(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.story_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view story gallery" ON public.story_gallery FOR SELECT USING (true);
CREATE POLICY "Admin/editor can insert story gallery" ON public.story_gallery FOR INSERT WITH CHECK (is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can update story gallery" ON public.story_gallery FOR UPDATE USING (is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can delete story gallery" ON public.story_gallery FOR DELETE USING (is_admin_or_editor(auth.uid()));

-- Create site_images table for managing all website images
CREATE TABLE public.site_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_key text NOT NULL UNIQUE,
  image_url text NOT NULL,
  label text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site images" ON public.site_images FOR SELECT USING (true);
CREATE POLICY "Admin/editor can insert site images" ON public.site_images FOR INSERT WITH CHECK (is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can update site images" ON public.site_images FOR UPDATE USING (is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can delete site images" ON public.site_images FOR DELETE USING (is_admin_or_editor(auth.uid()));

CREATE TRIGGER update_site_images_updated_at BEFORE UPDATE ON public.site_images
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create vision_documents table for downloadable documents on the Vision page
CREATE TABLE public.vision_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  document_url text NOT NULL,
  file_name text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vision_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vision documents" ON public.vision_documents FOR SELECT USING (true);
CREATE POLICY "Admin/editor can insert vision documents" ON public.vision_documents FOR INSERT WITH CHECK (is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can update vision documents" ON public.vision_documents FOR UPDATE USING (is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can delete vision documents" ON public.vision_documents FOR DELETE USING (is_admin_or_editor(auth.uid()));
