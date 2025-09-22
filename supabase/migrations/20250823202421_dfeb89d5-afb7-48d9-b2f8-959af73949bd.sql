
-- 1) Tabela de vendas/commissions do afiliado
create table if not exists public.affiliate_sales (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,                           -- ID do afiliado (auth.uid())
  order_id text not null,                          -- ID/Número do pedido
  product_name text,                               -- Nome do produto/serviço
  sale_date timestamptz not null default now(),    -- Data da venda
  amount numeric(12,2) not null default 0,         -- Valor bruto da venda
  commission_amount numeric(12,2) not null default 0, -- Valor da comissão do afiliado
  status text not null default 'paid',             -- paid | pending | refunded | canceled
  metadata jsonb default '{}'::jsonb,              -- Dados adicionais flexíveis
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Habilitar RLS
alter table public.affiliate_sales enable row level security;

-- 3) Políticas de acesso
-- Afiliado pode ler suas próprias vendas
create policy if not exists "Affiliates can view own sales"
  on public.affiliate_sales
  for select
  using (auth.uid() = user_id);

-- Admin pode ler todas as vendas
create policy if not exists "Admins can view all affiliate sales"
  on public.affiliate_sales
  for select
  using (is_admin(auth.uid()));

-- Somente admin pode inserir
create policy if not exists "Admins can insert affiliate sales"
  on public.affiliate_sales
  for insert
  with check (is_admin(auth.uid()) OR (current_setting('app.admin_bypass', true) = 'true'));

-- Somente admin pode atualizar
create policy if not exists "Admins can update affiliate sales"
  on public.affiliate_sales
  for update
  using (is_admin(auth.uid()) OR (current_setting('app.admin_bypass', true) = 'true'));

-- Somente admin pode deletar
create policy if not exists "Admins can delete affiliate sales"
  on public.affiliate_sales
  for delete
  using (is_admin(auth.uid()) OR (current_setting('app.admin_bypass', true) = 'true'));

-- 4) Trigger para manter updated_at
drop trigger if exists trg_affiliate_sales_updated_at on public.affiliate_sales;
create trigger trg_affiliate_sales_updated_at
before update on public.affiliate_sales
for each row execute function public.update_updated_at_column();

-- 5) Índices para performance em consultas por afiliado/período
create index if not exists idx_affiliate_sales_user_date
  on public.affiliate_sales (user_id, sale_date desc);

create index if not exists idx_affiliate_sales_status
  on public.affiliate_sales (status);
