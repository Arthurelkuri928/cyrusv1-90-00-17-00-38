
-- 1) Remover duplicidades antes de criar UNIQUE
DELETE FROM public.admin_permissions ap
USING public.admin_permissions ap2
WHERE ap.id < ap2.id
  AND ap.admin_id = ap2.admin_id
  AND ap.permission_id = ap2.permission_id;

-- 2) Criar chaves estrangeiras (só se ainda não existirem)
DO $$
BEGIN
  -- FK para profiles.id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'admin_permissions_admin_id_fkey'
  ) THEN
    ALTER TABLE public.admin_permissions
      ADD CONSTRAINT admin_permissions_admin_id_fkey
      FOREIGN KEY (admin_id)
      REFERENCES public.profiles(id)
      ON DELETE CASCADE;
  END IF;

  -- FK para permissions.id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'admin_permissions_permission_id_fkey'
  ) THEN
    ALTER TABLE public.admin_permissions
      ADD CONSTRAINT admin_permissions_permission_id_fkey
      FOREIGN KEY (permission_id)
      REFERENCES public.permissions(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- 3) Garantir unicidade de (admin_id, permission_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'admin_permissions_admin_permission_unique'
  ) THEN
    ALTER TABLE public.admin_permissions
      ADD CONSTRAINT admin_permissions_admin_permission_unique
      UNIQUE (admin_id, permission_id);
  END IF;
END $$;

-- 4) Índices para performance (idempotentes)
CREATE INDEX IF NOT EXISTS idx_admin_permissions_admin_id
  ON public.admin_permissions (admin_id);

CREATE INDEX IF NOT EXISTS idx_admin_permissions_permission_id
  ON public.admin_permissions (permission_id);

-- 5) Habilitar RLS e criar policy de leitura segura para admin_master
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admin_permissions'
      AND policyname = 'admin_master_can_read_admin_permissions'
  ) THEN
    CREATE POLICY admin_master_can_read_admin_permissions
      ON public.admin_permissions
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.profiles p
          WHERE p.id = auth.uid()
            AND TRIM(p.role) = 'admin_master'
        )
      );
  END IF;
END $$;
