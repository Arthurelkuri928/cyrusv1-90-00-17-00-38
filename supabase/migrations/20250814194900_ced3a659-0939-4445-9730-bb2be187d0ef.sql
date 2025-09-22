-- Habilitar Realtime na tabela tools
ALTER TABLE public.tools REPLICA IDENTITY FULL;

-- Adicionar a tabela tools à publicação realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.tools;