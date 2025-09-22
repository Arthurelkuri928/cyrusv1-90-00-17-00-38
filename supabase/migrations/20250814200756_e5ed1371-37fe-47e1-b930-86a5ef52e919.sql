-- Criar tabela para controle de visibilidade de páginas
CREATE TABLE public.page_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT UNIQUE NOT NULL,
  page_name TEXT NOT NULL,
  page_description TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.page_visibility ENABLE ROW LEVEL SECURITY;

-- Política para leitura por usuários autenticados
CREATE POLICY "Authenticated users can read page visibility"
ON public.page_visibility
FOR SELECT
TO authenticated
USING (true);

-- Política para admins poderem modificar
CREATE POLICY "Admins can manage page visibility"
ON public.page_visibility
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Habilitar Realtime
ALTER TABLE public.page_visibility REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_visibility;

-- Inserir páginas iniciais
INSERT INTO public.page_visibility (page_key, page_name, page_description, is_visible) VALUES
('dashboard', 'Dashboard', 'Página principal da área de membros', true),
('favorites', 'Favoritos', 'Ferramentas favoritas do usuário', true),
('subscription', 'Assinatura', 'Gerenciamento de planos e assinatura', true),
('affiliates', 'Afiliados', 'Programa de afiliados e dashboard', true),
('settings', 'Configurações', 'Configurações da conta e preferências', true),
('profile', 'Perfil', 'Informações do perfil do usuário', true),
('support', 'Suporte', 'Central de ajuda para membros', true);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_page_visibility_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp automaticamente
CREATE TRIGGER update_page_visibility_updated_at
  BEFORE UPDATE ON public.page_visibility
  FOR EACH ROW
  EXECUTE FUNCTION public.update_page_visibility_updated_at();