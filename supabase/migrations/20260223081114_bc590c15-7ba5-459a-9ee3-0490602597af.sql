-- Add slug column to impact_stories
ALTER TABLE public.impact_stories ADD COLUMN slug text;

-- Create unique index on slug
CREATE UNIQUE INDEX idx_impact_stories_slug ON public.impact_stories(slug) WHERE slug IS NOT NULL;

-- Create notification_emails table for contact message forwarding
CREATE TABLE public.notification_emails (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view notification emails" ON public.notification_emails FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can insert notification emails" ON public.notification_emails FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can update notification emails" ON public.notification_emails FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can delete notification emails" ON public.notification_emails FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
