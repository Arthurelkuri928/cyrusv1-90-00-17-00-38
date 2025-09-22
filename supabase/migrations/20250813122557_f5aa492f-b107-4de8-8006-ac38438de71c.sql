
-- Habilitar REPLICA IDENTITY FULL para capturar dados completos durante updates
ALTER TABLE public.tools REPLICA IDENTITY FULL;

-- Adicionar a tabela à publicação realtime do Supabase
ALTER PUBLICATION supabase_realtime ADD TABLE public.tools;
