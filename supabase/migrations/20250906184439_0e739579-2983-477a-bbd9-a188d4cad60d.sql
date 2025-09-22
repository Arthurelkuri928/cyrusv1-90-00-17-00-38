
-- 1) Função de limpeza automática dos itens na lixeira há mais de 30 dias
create or replace function public.purge_old_deleted_tools()
returns integer
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_deleted_count integer := 0;
begin
  -- Permitir bypass das policies usando o GUC já previsto nas RLS da tabela tools
  perform set_config('app.admin_bypass', 'true', true);

  delete from public.tools
  where deleted_at is not null
    and deleted_at < (now() - interval '30 days');

  get diagnostics v_deleted_count = row_count;
  return v_deleted_count;
end;
$$;

-- 2) Índice para acelerar a varredura por deleted_at
create index if not exists idx_tools_deleted_at on public.tools (deleted_at);

-- 3) Habilitar o pg_cron (se ainda não estiver habilitado)
create extension if not exists pg_cron;

-- 4) (Re)agendar o job diário às 03:00 UTC para executar a limpeza
do $$
begin
  if exists (select 1 from cron.job where jobname = 'purge_tools_trash_daily') then
    perform cron.unschedule((select jobid from cron.job where jobname = 'purge_tools_trash_daily' order by jobid desc limit 1));
  end if;

  perform cron.schedule(
    'purge_tools_trash_daily',
    '0 3 * * *',
    $$ select public.purge_old_deleted_tools(); $$
  );
end
$$;
