
-- Create table for general header settings (logo, etc.)
CREATE TABLE public.header_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for action buttons in header
CREATE TABLE public.header_action_buttons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  style TEXT NOT NULL DEFAULT 'primary', -- 'primary' or 'secondary'
  is_visible BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for navigation items (supports hierarchical structure)
CREATE TABLE public.header_nav_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'link', -- 'link' or 'dropdown'
  url TEXT, -- for direct links
  page_slug TEXT, -- for internal pages
  parent_id UUID REFERENCES public.header_nav_items(id) ON DELETE CASCADE,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for header_settings
ALTER TABLE public.header_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view header settings" 
  ON public.header_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can modify header settings" 
  ON public.header_settings 
  FOR ALL 
  USING (is_admin(auth.uid())) 
  WITH CHECK (is_admin(auth.uid()));

-- Add RLS policies for header_action_buttons
ALTER TABLE public.header_action_buttons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible action buttons" 
  ON public.header_action_buttons 
  FOR SELECT 
  USING (is_visible = true);

CREATE POLICY "Admins can view all action buttons" 
  ON public.header_action_buttons 
  FOR SELECT 
  USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can modify action buttons" 
  ON public.header_action_buttons 
  FOR INSERT, UPDATE, DELETE 
  USING (is_admin(auth.uid())) 
  WITH CHECK (is_admin(auth.uid()));

-- Add RLS policies for header_nav_items
ALTER TABLE public.header_nav_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible nav items" 
  ON public.header_nav_items 
  FOR SELECT 
  USING (is_visible = true);

CREATE POLICY "Admins can view all nav items" 
  ON public.header_nav_items 
  FOR SELECT 
  USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can modify nav items" 
  ON public.header_nav_items 
  FOR INSERT, UPDATE, DELETE 
  USING (is_admin(auth.uid())) 
  WITH CHECK (is_admin(auth.uid()));

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_header_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_header_settings_updated_at
  BEFORE UPDATE ON public.header_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_header_settings_updated_at();

CREATE OR REPLACE FUNCTION public.update_header_action_buttons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_header_action_buttons_updated_at
  BEFORE UPDATE ON public.header_action_buttons
  FOR EACH ROW EXECUTE FUNCTION public.update_header_action_buttons_updated_at();

CREATE OR REPLACE FUNCTION public.update_header_nav_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_header_nav_items_updated_at
  BEFORE UPDATE ON public.header_nav_items
  FOR EACH ROW EXECUTE FUNCTION public.update_header_nav_items_updated_at();

-- Insert default header settings
INSERT INTO public.header_settings (logo_url) 
VALUES ('https://i.postimg.cc/sf0yGXBJ/2.png');

-- Insert default action buttons
INSERT INTO public.header_action_buttons (label, url, style, position) VALUES
('Login', '/entrar', 'secondary', 1),
('Comprar', '/cadastro', 'primary', 2);

-- Insert default navigation items
INSERT INTO public.header_nav_items (label, type, page_slug, position) VALUES
('Início', 'link', 'home', 1),
('Planos', 'dropdown', 'plans', 2),
('Parceria', 'link', 'partnership', 3),
('Afiliados', 'link', 'affiliates-public', 4);

-- Insert sub-items for Planos dropdown
INSERT INTO public.header_nav_items (label, type, url, parent_id, position) 
SELECT 'Planos Iniciais', 'link', '/planos-iniciais', id, 1 
FROM public.header_nav_items WHERE label = 'Planos' AND type = 'dropdown';

INSERT INTO public.header_nav_items (label, type, url, parent_id, position) 
SELECT 'Planos Padrões', 'link', '/planos-padroes', id, 2 
FROM public.header_nav_items WHERE label = 'Planos' AND type = 'dropdown';

INSERT INTO public.header_nav_items (label, type, url, parent_id, position) 
SELECT 'Planos Premium', 'link', '/planos-premium', id, 3 
FROM public.header_nav_items WHERE label = 'Planos' AND type = 'dropdown';
