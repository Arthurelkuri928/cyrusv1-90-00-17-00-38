
-- Remove a política atual que requer autenticação
DROP POLICY "Authenticated users can read pages visibility" ON public.pages;

-- Cria nova política que permite acesso público de leitura
CREATE POLICY "Public read access to pages visibility" 
  ON public.pages 
  FOR SELECT 
  USING (true);

-- Mantém as políticas restritivas para operações de modificação
-- (INSERT, UPDATE, DELETE já estão configuradas corretamente para usuários autenticados)
