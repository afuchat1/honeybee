
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: check if user is admin or editor
CREATE OR REPLACE FUNCTION public.is_admin_or_editor(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'editor')
  )
$$;

-- Programs table
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  goals TEXT[] DEFAULT '{}',
  outcomes TEXT[] DEFAULT '{}',
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Daily prayers table
CREATE TABLE public.daily_prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_date DATE NOT NULL UNIQUE,
  scripture_text TEXT NOT NULL DEFAULT '',
  scripture_reference TEXT NOT NULL DEFAULT '',
  reflection TEXT NOT NULL DEFAULT '',
  prayer TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.daily_prayers ENABLE ROW LEVEL SECURITY;

-- Impact stories table
CREATE TABLE public.impact_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.impact_stories ENABLE ROW LEVEL SECURITY;

-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Gallery table
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  category TEXT DEFAULT 'general',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Governance docs table
CREATE TABLE public.governance_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  document_url TEXT,
  section TEXT NOT NULL DEFAULT 'general',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.governance_docs ENABLE ROW LEVEL SECURITY;

-- Site settings table
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Activity logs table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_daily_prayers_updated_at BEFORE UPDATE ON public.daily_prayers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_impact_stories_updated_at BEFORE UPDATE ON public.impact_stories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_governance_docs_updated_at BEFORE UPDATE ON public.governance_docs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========== RLS POLICIES ==========

-- Profiles: users read own, admins read all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User roles: only admins can manage
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Programs: public read, admin/editor write
CREATE POLICY "Anyone can view programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Admin/editor can insert programs" ON public.programs FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can update programs" ON public.programs FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can delete programs" ON public.programs FOR DELETE USING (public.is_admin_or_editor(auth.uid()));

-- Daily prayers: public read, admin/editor write
CREATE POLICY "Anyone can view prayers" ON public.daily_prayers FOR SELECT USING (true);
CREATE POLICY "Admin/editor can insert prayers" ON public.daily_prayers FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can update prayers" ON public.daily_prayers FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can delete prayers" ON public.daily_prayers FOR DELETE USING (public.is_admin_or_editor(auth.uid()));

-- Impact stories: public read, admin/editor write
CREATE POLICY "Anyone can view stories" ON public.impact_stories FOR SELECT USING (true);
CREATE POLICY "Admin/editor can insert stories" ON public.impact_stories FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can update stories" ON public.impact_stories FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can delete stories" ON public.impact_stories FOR DELETE USING (public.is_admin_or_editor(auth.uid()));

-- Contact messages: anyone can insert, admin/editor can read/manage
CREATE POLICY "Anyone can submit contact" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin/editor can view messages" ON public.contact_messages FOR SELECT USING (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can update messages" ON public.contact_messages FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can delete messages" ON public.contact_messages FOR DELETE USING (public.is_admin_or_editor(auth.uid()));

-- Gallery: public read, admin/editor write
CREATE POLICY "Anyone can view gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Admin/editor can insert gallery" ON public.gallery FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can update gallery" ON public.gallery FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can delete gallery" ON public.gallery FOR DELETE USING (public.is_admin_or_editor(auth.uid()));

-- Governance docs: public read, admin/editor write
CREATE POLICY "Anyone can view governance" ON public.governance_docs FOR SELECT USING (true);
CREATE POLICY "Admin/editor can insert governance" ON public.governance_docs FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can update governance" ON public.governance_docs FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can delete governance" ON public.governance_docs FOR DELETE USING (public.is_admin_or_editor(auth.uid()));

-- Site settings: public read, admin only write
CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin can insert settings" ON public.site_settings FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update settings" ON public.site_settings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete settings" ON public.site_settings FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Activity logs: admin can view, admin/editor can insert
CREATE POLICY "Admin can view logs" ON public.activity_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin/editor can insert logs" ON public.activity_logs FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

CREATE POLICY "Anyone can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Admin/editor can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can update uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'uploads' AND public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/editor can delete uploads" ON storage.objects FOR DELETE USING (bucket_id = 'uploads' AND public.is_admin_or_editor(auth.uid()));

-- Seed default site settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
  ('site_name', 'Honeybee Ministries'),
  ('site_tagline', 'Together we build a hive of hope'),
  ('contact_email', 'info@honeybeeministries.org'),
  ('contact_phone', '+256 XXX XXX XXX'),
  ('contact_address', 'Eastern Uganda'),
  ('facebook_url', ''),
  ('twitter_url', ''),
  ('instagram_url', ''),
  ('meta_description', 'Honeybee Ministries is a faith-based NGO in Eastern Uganda providing special needs support, youth mentorship, and skills development.');
