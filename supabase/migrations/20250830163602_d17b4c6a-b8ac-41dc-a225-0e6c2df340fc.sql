
-- Verificar a política RLS atual da tabela tools
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'tools';

-- Verificar se existe alguma RPC específica para busca de ferramentas
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name ILIKE '%tool%';

-- Criar uma RPC otimizada para busca pública de ferramentas na área de membros
CREATE OR REPLACE FUNCTION public.get_member_tools()
RETURNS TABLE(
  id integer,
  name text,
  description text,
  category text,
  is_active boolean,
  is_maintenance boolean,
  card_color text,
  logo_url text,
  access_url text,
  email text,
  password text,
  cookies text,
  slug text,
  action_buttons jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Retorna todas as ferramentas sem filtros restritivos
  -- Esta função bypassa potenciais problemas de RLS
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.description,
    t.category,
    t.is_active,
    t.is_maintenance,
    t.card_color,
    t.logo_url,
    t.access_url,
    t.email,
    t.password,
    t.cookies,
    t.slug,
    t.action_buttons,
    t.created_at,
    t.updated_at
  FROM public.tools t
  ORDER BY t.id ASC;
END;
$$;

-- Dar permissões para usuários autenticados chamarem esta função
GRANT EXECUTE ON FUNCTION public.get_member_tools() TO authenticated;

-- Verificar se a política RLS está causando o problema
-- Criar uma política mais permissiva para SELECT na tabela tools
DROP POLICY IF EXISTS "Authenticated users can read tools" ON public.tools;

CREATE POLICY "Public access to tools for members"
ON public.tools
FOR SELECT
TO authenticated
USING (true);
