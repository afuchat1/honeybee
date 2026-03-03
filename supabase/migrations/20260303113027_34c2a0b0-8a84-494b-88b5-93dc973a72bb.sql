CREATE TABLE public.program_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES public.programs(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text DEFAULT '',
  content text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.program_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view program gallery" ON public.program_gallery FOR SELECT USING (true);
CREATE POLICY "Admin/editor can insert program gallery" ON public.program_gallery FOR INSERT WITH CHECK (is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can update program gallery" ON public.program_gallery FOR UPDATE USING (is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can delete program gallery" ON public.program_gallery FOR DELETE USING (is_admin_or_editor(auth.uid()));