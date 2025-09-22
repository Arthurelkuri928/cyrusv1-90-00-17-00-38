-- Corrigir o mapeamento do header para apontar para a página pública correta
UPDATE header_nav_items 
SET page_slug = 'affiliates-public'
WHERE label = 'Afiliados' AND page_slug = 'affiliates';

-- Corrigir a visibilidade da página pública de afiliados (deve estar visível por padrão)
UPDATE pages 
SET is_visible = true 
WHERE slug = 'affiliates-public';