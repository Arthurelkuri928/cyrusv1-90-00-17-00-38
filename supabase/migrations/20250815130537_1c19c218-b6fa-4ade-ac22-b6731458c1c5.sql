-- Inserir páginas faltantes na tabela pages
INSERT INTO public.pages (slug, name, is_visible) VALUES 
  ('affiliates-public', 'Afiliados Público', true),
  ('initial-plans', 'Planos Iniciais', true),
  ('standard-plans', 'Planos Padrões', true),
  ('premium-plans', 'Planos Premium', true)
ON CONFLICT (slug) DO NOTHING;