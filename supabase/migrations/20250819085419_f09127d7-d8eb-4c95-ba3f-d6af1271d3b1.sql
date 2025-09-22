
DO $$
BEGIN
  -- Cria trigger para limpar credenciais ao excluir uma ferramenta (se ainda não existir)
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_tools_cleanup_tool_data'
  ) THEN
    CREATE TRIGGER trg_tools_cleanup_tool_data
    AFTER DELETE ON public.tools
    FOR EACH ROW
    EXECUTE FUNCTION public.cleanup_tool_data();
  END IF;
END $$;
