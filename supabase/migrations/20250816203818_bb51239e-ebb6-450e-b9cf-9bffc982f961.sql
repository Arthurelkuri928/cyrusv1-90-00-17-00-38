
-- Etapa 1: Limpar dados corrompidos na tabela profiles
UPDATE public.profiles 
SET role = TRIM(role) 
WHERE role LIKE '%admin%' OR role LIKE '%user%' OR role != TRIM(role);

-- Etapa 2: Melhorar a função is_admin() para ser resiliente a espaços em branco
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND TRIM(role) = 'admin'
  );
$function$

-- Etapa 3: Criar trigger para prevenir futuros problemas de dados
CREATE OR REPLACE FUNCTION public.clean_role_before_insert_update()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Limpar espaços em branco do role antes de inserir/atualizar
  NEW.role = TRIM(NEW.role);
  RETURN NEW;
END;
$function$

-- Aplicar o trigger na tabela profiles
DROP TRIGGER IF EXISTS clean_role_trigger ON public.profiles;
CREATE TRIGGER clean_role_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.clean_role_before_insert_update();

-- Etapa 4: Verificar se a política RLS está correta (ela já está, mas vamos confirmar)
-- A política existente deve funcionar agora com a função is_admin() corrigida
-- CREATE POLICY "Allow admin users to update tools" 
-- ON public.tools 
-- FOR UPDATE 
-- USING (is_admin(auth.uid())) 
-- WITH CHECK (is_admin(auth.uid()));
