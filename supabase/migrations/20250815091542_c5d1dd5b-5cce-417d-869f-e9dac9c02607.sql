
-- Fase 1.1: Criar tabela page_visibility correta
CREATE TABLE IF NOT EXISTS public.page_visibility (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  page_name TEXT NOT NULL,
  page_description TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir dados iniciais das páginas
INSERT INTO public.page_visibility (page_key, page_name, page_description, is_visible) VALUES
('dashboard', 'Dashboard', 'Página principal da área de membros', true),
('profile', 'Perfil', 'Página de visualização do perfil do usuário', true),
('settings', 'Configurações', 'Página de configurações da conta', true),
('favorites', 'Favoritos', 'Página de ferramentas favoritas', true),
('subscription', 'Assinatura', 'Página de gerenciamento de assinatura', true),
('affiliates', 'Afiliados', 'Dashboard de afiliados', true),
('support', 'Suporte', 'Página de suporte ao membro', true),
('tools', 'Ferramentas', 'Catálogo de ferramentas', true),
('billing', 'Faturamento', 'Página de faturamento', true),
('reports', 'Relatórios', 'Página de relatórios', true)
ON CONFLICT (page_key) DO NOTHING;

-- Fase 1.2: Adicionar usuário mock como admin
INSERT INTO public.profiles (id, role) VALUES 
('mock_user_id', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Habilitar RLS na tabela page_visibility
ALTER TABLE public.page_visibility ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para page_visibility
CREATE POLICY "Users can read page visibility" 
  ON public.page_visibility 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage page visibility" 
  ON public.page_visibility 
  FOR ALL 
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_page_visibility_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_page_visibility_updated_at
  BEFORE UPDATE ON public.page_visibility
  FOR EACH ROW EXECUTE FUNCTION public.update_page_visibility_updated_at();

-- Fase 1.3: Verificar e melhorar função is_admin()
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $function$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = user_id LIMIT 1),
    false
  );
$function$;
