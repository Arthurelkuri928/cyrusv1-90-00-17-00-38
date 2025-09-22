
-- Criar a tabela de anúncios
CREATE TABLE public.advertisements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_pt TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  description_pt TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  cta_button_1_text_pt TEXT,
  cta_button_1_text_en TEXT,
  cta_button_1_text_es TEXT,
  cta_button_1_url TEXT,
  cta_button_2_text_pt TEXT,
  cta_button_2_text_en TEXT,
  cta_button_2_text_es TEXT,
  cta_button_2_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (todos os usuários autenticados podem ver)
CREATE POLICY "Authenticated users can view active advertisements" 
  ON public.advertisements 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL AND is_active = true);

-- Política para administradores gerenciarem anúncios
CREATE POLICY "Admins can manage advertisements" 
  ON public.advertisements 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Criar índices para performance
CREATE INDEX idx_advertisements_active_order ON public.advertisements (is_active, display_order) WHERE is_active = true;
CREATE INDEX idx_advertisements_dates ON public.advertisements (start_date, end_date);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_advertisements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_advertisements_updated_at
  BEFORE UPDATE ON public.advertisements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_advertisements_updated_at();

-- Inserir dados iniciais baseados no sistema atual
INSERT INTO public.advertisements (
  title_pt, title_en, title_es,
  description_pt, description_en, description_es,
  video_url, thumbnail_url,
  cta_button_1_text_pt, cta_button_1_text_en, cta_button_1_text_es, cta_button_1_url,
  cta_button_2_text_pt, cta_button_2_text_en, cta_button_2_text_es, cta_button_2_url,
  display_order, is_active
) VALUES 
(
  'Acelere Seu Crescimento Digital', 'Accelerate Your Digital Growth', 'Acelera Tu Crecimiento Digital',
  'Descubra ferramentas premium que transformam seu negócio online', 'Discover premium tools that transform your online business', 'Descubre herramientas premium que transforman tu negocio online',
  'https://vimeo.com/1088164033', 'https://vumbnail.com/1088164033.jpg',
  'Começar Agora', 'Start Now', 'Empezar Ahora', '#',
  'Saiba Mais', 'Learn More', 'Saber Más', '#',
  1, true
),
(
  'Tecnologia de Ponta', 'Cutting-Edge Technology', 'Tecnología de Vanguardia',
  'Acesse as melhores soluções do mercado', 'Access the best market solutions', 'Accede a las mejores soluciones del mercado',
  'https://vimeo.com/1088164446', 'https://vumbnail.com/1088164446.jpg',
  'Começar Agora', 'Start Now', 'Empezar Ahora', '#',
  'Saiba Mais', 'Learn More', 'Saber Más', '#',
  2, true
),
(
  'Resultados Comprovados', 'Proven Results', 'Resultados Comprobados',
  'Junte-se a milhares de profissionais de sucesso', 'Join thousands of successful professionals', 'Únete a miles de profesionales exitosos',
  'https://vimeo.com/1087908741', 'https://vumbnail.com/1087908741.jpg',
  'Começar Agora', 'Start Now', 'Empezar Ahora', '#',
  'Saiba Mais', 'Learn More', 'Saber Más', '#',
  3, true
),
(
  'Inovação Constante', 'Constant Innovation', 'Innovación Constante',
  'Sempre um passo à frente da concorrência', 'Always one step ahead of the competition', 'Siempre un paso adelante de la competencia',
  'https://vimeo.com/1087908873', 'https://vumbnail.com/1087908873.jpg',
  'Começar Agora', 'Start Now', 'Empezar Ahora', '#',
  'Saiba Mais', 'Learn More', 'Saber Más', '#',
  4, true
);
