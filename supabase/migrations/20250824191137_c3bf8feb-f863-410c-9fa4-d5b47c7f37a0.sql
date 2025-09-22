
-- 1) Tabela de Pagamentos de Assinaturas
CREATE TABLE public.assinaturas_pagamentos (
  id_transacao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  valor_pago NUMERIC(10,2) NOT NULL,
  moeda TEXT NOT NULL DEFAULT 'BRL',
  data_pagamento TIMESTAMPTZ NOT NULL DEFAULT now(),
  status_pagamento TEXT NOT NULL DEFAULT 'pago',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT status_pagamento_valido CHECK (status_pagamento IN ('pago','pendente','falha'))
);

-- 2) RLS: Habilitar e políticas de segurança
ALTER TABLE public.assinaturas_pagamentos ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas seus próprios registros; admins veem todos
CREATE POLICY "select_own_or_admin_assinaturas_pagamentos"
ON public.assinaturas_pagamentos
FOR SELECT
USING (auth.uid() = id_usuario OR is_admin(auth.uid()));

-- Inserção: o próprio usuário (ou admin) pode criar registros
CREATE POLICY "insert_own_or_admin_assinaturas_pagamentos"
ON public.assinaturas_pagamentos
FOR INSERT
WITH CHECK (auth.uid() = id_usuario OR is_admin(auth.uid()));

-- Atualização: apenas admin
CREATE POLICY "update_admin_only_assinaturas_pagamentos"
ON public.assinaturas_pagamentos
FOR UPDATE
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Exclusão: apenas admin
CREATE POLICY "delete_admin_only_assinaturas_pagamentos"
ON public.assinaturas_pagamentos
FOR DELETE
USING (is_admin(auth.uid()));

-- 3) Índices úteis
CREATE INDEX idx_assinaturas_pagamentos_usuario ON public.assinaturas_pagamentos (id_usuario);
CREATE INDEX idx_assinaturas_pagamentos_data ON public.assinaturas_pagamentos (data_pagamento);

-- 4) Trigger para manter updated_at sempre correto
CREATE TRIGGER set_updated_at_assinaturas_pagamentos
BEFORE UPDATE ON public.assinaturas_pagamentos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
