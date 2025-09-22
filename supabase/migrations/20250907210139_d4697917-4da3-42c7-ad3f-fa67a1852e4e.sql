-- ==================================================
-- FASE 1: FUNDAÇÃO DO BANCO DE DADOS - SISTEMA DE ASSINATURAS CYRUS
-- ==================================================

-- 1. Tabela para mapear clientes do Supabase para clientes do Stripe
CREATE TABLE public.stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabela para armazenar o estado das assinaturas ativas
CREATE TABLE public.stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  plan_id UUID REFERENCES public.products(id),
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabela para controle de IPs que utilizaram o período de teste
CREATE TABLE public.trial_ip_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  trial_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabela para histórico detalhado de pagamentos e faturas
CREATE TABLE public.stripe_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  subscription_id UUID REFERENCES public.stripe_subscriptions(id) ON DELETE SET NULL,
  amount_paid INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'brl',
  status TEXT NOT NULL,
  invoice_pdf TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================================================
-- ÍNDICES DE PERFORMANCE
-- ==================================================

-- Índices para stripe_customers
CREATE INDEX idx_stripe_customers_user_id ON public.stripe_customers(user_id);
CREATE INDEX idx_stripe_customers_stripe_id ON public.stripe_customers(stripe_customer_id);

-- Índices para stripe_subscriptions
CREATE INDEX idx_stripe_subscriptions_user_id ON public.stripe_subscriptions(user_id);
CREATE INDEX idx_stripe_subscriptions_stripe_id ON public.stripe_subscriptions(stripe_subscription_id);
CREATE INDEX idx_stripe_subscriptions_customer_id ON public.stripe_subscriptions(stripe_customer_id);
CREATE INDEX idx_stripe_subscriptions_status ON public.stripe_subscriptions(status);
CREATE INDEX idx_stripe_subscriptions_period_end ON public.stripe_subscriptions(current_period_end);

-- Índices para trial_ip_tracking
CREATE INDEX idx_trial_ip_tracking_user_id ON public.trial_ip_tracking(user_id);
CREATE INDEX idx_trial_ip_tracking_ip ON public.trial_ip_tracking(ip_address);

-- Índices para stripe_invoices
CREATE INDEX idx_stripe_invoices_user_id ON public.stripe_invoices(user_id);
CREATE INDEX idx_stripe_invoices_stripe_id ON public.stripe_invoices(stripe_invoice_id);
CREATE INDEX idx_stripe_invoices_subscription_id ON public.stripe_invoices(subscription_id);
CREATE INDEX idx_stripe_invoices_status ON public.stripe_invoices(status);

-- ==================================================
-- TRIGGERS PARA UPDATED_AT
-- ==================================================

-- Trigger para stripe_customers
CREATE TRIGGER update_stripe_customers_updated_at
  BEFORE UPDATE ON public.stripe_customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para stripe_subscriptions
CREATE TRIGGER update_stripe_subscriptions_updated_at
  BEFORE UPDATE ON public.stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ==================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ==================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_ip_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_invoices ENABLE ROW LEVEL SECURITY;

-- Políticas para stripe_customers
CREATE POLICY "Users can view their own stripe customer data"
  ON public.stripe_customers
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage stripe customers"
  ON public.stripe_customers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Políticas para stripe_subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.stripe_subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions"
  ON public.stripe_subscriptions
  FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Service role can manage subscriptions"
  ON public.stripe_subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Políticas para trial_ip_tracking
CREATE POLICY "Users can view their own trial records"
  ON public.trial_ip_tracking
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all trial records"
  ON public.trial_ip_tracking
  FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Service role can manage trial tracking"
  ON public.trial_ip_tracking
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Políticas para stripe_invoices
CREATE POLICY "Users can view their own invoices"
  ON public.stripe_invoices
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all invoices"
  ON public.stripe_invoices
  FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Service role can manage invoices"
  ON public.stripe_invoices
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ==================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- ==================================================

COMMENT ON TABLE public.stripe_customers IS 'Mapeamento entre usuários do Supabase e clientes do Stripe';
COMMENT ON TABLE public.stripe_subscriptions IS 'Estado das assinaturas ativas e históricas do Stripe';
COMMENT ON TABLE public.trial_ip_tracking IS 'Controle de IPs que utilizaram o período de teste para evitar fraudes';
COMMENT ON TABLE public.stripe_invoices IS 'Histórico detalhado de faturas e pagamentos do Stripe';