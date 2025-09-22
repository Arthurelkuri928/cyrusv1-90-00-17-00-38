
-- Inserir faturas de teste para o usuário teste@exemplo.com
INSERT INTO public.assinaturas_pagamentos (
  id_transacao,
  id_usuario,
  valor_pago,
  moeda,
  data_pagamento,
  status_pagamento
) VALUES 
(
  gen_random_uuid(),
  '9582dcd0-ad59-445b-848d-f5aa935e2c74',
  97.00,
  'BRL',
  now() - interval '1 month',
  'pago'
),
(
  gen_random_uuid(),
  '9582dcd0-ad59-445b-848d-f5aa935e2c74',
  97.00,
  'BRL',
  now() - interval '2 months',
  'pago'
),
(
  gen_random_uuid(),
  '9582dcd0-ad59-445b-848d-f5aa935e2c74',
  97.00,
  'BRL',
  now() - interval '3 months',
  'pago'
);
