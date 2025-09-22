
-- Corrigir a função is_admin() com práticas de segurança adequadas
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$function$;

-- Verificar e recriar as políticas RLS da tabela pages
DROP POLICY IF EXISTS "Admins can manage pages" ON public.pages;
DROP POLICY IF EXISTS "Users can read pages visibility" ON public.pages;

-- Política para permitir que admins gerenciem todas as páginas
CREATE POLICY "Admins can manage pages" 
ON public.pages 
FOR ALL 
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Política para permitir que todos os usuários autenticados leiam a visibilidade das páginas
CREATE POLICY "Users can read pages visibility" 
ON public.pages 
FOR SELECT 
TO authenticated
USING (true);

-- Verificar se o trigger de updated_at está funcionando corretamente
DROP TRIGGER IF EXISTS update_pages_updated_at ON public.pages;

CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_pages_updated_at();

-- Função para debug da autenticação (temporária)
CREATE OR REPLACE FUNCTION public.debug_admin_check()
RETURNS TABLE(
  current_user_id uuid,
  user_exists boolean,
  user_role text,
  is_admin_result boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT 
    auth.uid() as current_user_id,
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid()) as user_exists,
    (SELECT role FROM public.profiles WHERE id = auth.uid()) as user_role,
    public.is_admin(auth.uid()) as is_admin_result;
$function$;
