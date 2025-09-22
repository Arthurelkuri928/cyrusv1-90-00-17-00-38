-- FASE 1: Correção Imediata - Restaurar acesso do administrador master
-- Associar todas as permissões existentes ao usuário admin@empresa.com

-- Inserir todas as permissões para o administrador master
INSERT INTO public.admin_permissions (admin_id, permission_id, granted_by, granted_at)
SELECT 
  '9c0244af-1c98-48a4-8ae6-79d0475ae08b'::uuid as admin_id,  -- ID do admin@empresa.com
  p.id as permission_id,
  '9c0244af-1c98-48a4-8ae6-79d0475ae08b'::uuid as granted_by,  -- Auto-concedido
  now() as granted_at
FROM public.permissions p
WHERE NOT EXISTS (
  SELECT 1 FROM public.admin_permissions ap 
  WHERE ap.admin_id = '9c0244af-1c98-48a4-8ae6-79d0475ae08b'::uuid 
  AND ap.permission_id = p.id
);

-- Verificar se as permissões foram inseridas corretamente
-- Esta consulta deve retornar todas as 26 permissões para o admin master
SELECT 
  ap.admin_id,
  u.email,
  p.code as permission_code,
  p.name as permission_name,
  p.category
FROM public.admin_permissions ap
JOIN public.permissions p ON ap.permission_id = p.id
JOIN auth.users u ON ap.admin_id = u.id
WHERE ap.admin_id = '9c0244af-1c98-48a4-8ae6-79d0475ae08b'::uuid
ORDER BY p.category, p.code;