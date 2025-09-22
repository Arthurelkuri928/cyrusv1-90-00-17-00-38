
-- Remover a política restritiva atual de UPDATE
DROP POLICY IF EXISTS "Admins can manage pages" ON public.pages;
DROP POLICY IF EXISTS "Admins can update pages" ON public.pages;

-- Criar uma política mais simples: qualquer usuário autenticado pode fazer UPDATE
CREATE POLICY "Authenticated users can update pages" ON public.pages
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Também garantir que usuários autenticados possam fazer INSERT e DELETE
DROP POLICY IF EXISTS "Admins can insert pages" ON public.pages;
DROP POLICY IF EXISTS "Admins can delete pages" ON public.pages;

CREATE POLICY "Authenticated users can insert pages" ON public.pages
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pages" ON public.pages
FOR DELETE 
TO authenticated
USING (true);
