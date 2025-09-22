
-- 0) Enum segura para alvo da notificação (ROLE ou USER)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_target_type') THEN
    CREATE TYPE public.notification_target_type AS ENUM ('ROLE', 'USER');
  END IF;
END$$;

-- 1) Tabela principal de notificações administrativas
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title         text NOT NULL,
  message       text,
  target_type   public.notification_target_type NOT NULL,
  target_values text[] NOT NULL DEFAULT '{}'::text[],
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Policies: leitura para admins, escrita apenas admin_master
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='admin_notifications' AND policyname='Admins can view admin notifications'
  ) THEN
    CREATE POLICY "Admins can view admin notifications"
      ON public.admin_notifications
      FOR SELECT
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='admin_notifications' AND policyname='Only admin_master can insert notifications'
  ) THEN
    CREATE POLICY "Only admin_master can insert notifications"
      ON public.admin_notifications
      FOR INSERT
      WITH CHECK (EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND TRIM(p.role) = 'admin_master'
      ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='admin_notifications' AND policyname='Only admin_master can update notifications'
  ) THEN
    CREATE POLICY "Only admin_master can update notifications"
      ON public.admin_notifications
      FOR UPDATE
      USING (EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND TRIM(p.role) = 'admin_master'
      ))
      WITH CHECK (EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND TRIM(p.role) = 'admin_master'
      ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='admin_notifications' AND policyname='Only admin_master can delete notifications'
  ) THEN
    CREATE POLICY "Only admin_master can delete notifications"
      ON public.admin_notifications
      FOR DELETE
      USING (EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND TRIM(p.role) = 'admin_master'
      ));
  END IF;
END$$;

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at 
  ON public.admin_notifications (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_target_type 
  ON public.admin_notifications (target_type);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_target_values_gin 
  ON public.admin_notifications USING GIN (target_values);

-- 2) Tabela de status de leitura de notificações
CREATE TABLE IF NOT EXISTS public.notification_read_status (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid NOT NULL REFERENCES public.admin_notifications(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  read_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (notification_id, user_id)
);

ALTER TABLE public.notification_read_status ENABLE ROW LEVEL SECURITY;

-- Policies para leitura própria (ou admin_master), e escrita própria
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='notification_read_status' AND policyname='Users can view own read statuses or admin_master can view all'
  ) THEN
    CREATE POLICY "Users can view own read statuses or admin_master can view all"
      ON public.notification_read_status
      FOR SELECT
      USING (
        user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.profiles p 
          WHERE p.id = auth.uid() AND TRIM(p.role) = 'admin_master'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='notification_read_status' AND policyname='Users can insert their own read statuses'
  ) THEN
    CREATE POLICY "Users can insert their own read statuses"
      ON public.notification_read_status
      FOR INSERT
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='notification_read_status' AND policyname='Users can update their own read statuses'
  ) THEN
    CREATE POLICY "Users can update their own read statuses"
      ON public.notification_read_status
      FOR UPDATE
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END$$;

-- 3) RPCs

-- 3.1) Criar notificação (somente admin_master)
CREATE OR REPLACE FUNCTION public.create_admin_notification(
  p_title        text,
  p_message      text,
  p_target_type  public.notification_target_type,
  p_target_values text[]
)
RETURNS public.admin_notifications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_role   text;
  new_row  public.admin_notifications;
BEGIN
  SELECT TRIM(role) INTO v_role FROM public.profiles WHERE id = auth.uid();

  IF v_role IS NULL OR v_role <> 'admin_master' THEN
    RAISE EXCEPTION 'Access denied. Only admin_master can create notifications.';
  END IF;

  INSERT INTO public.admin_notifications (created_by, title, message, target_type, target_values)
  VALUES (auth.uid(), p_title, p_message, p_target_type, p_target_values)
  RETURNING * INTO new_row;

  RETURN new_row;
END;
$$;

-- 3.2) Buscar notificações do usuário atual, com flag de leitura
CREATE OR REPLACE FUNCTION public.get_my_admin_notifications(
  p_limit  integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(
  id          uuid,
  title       text,
  message     text,
  created_at  timestamptz,
  created_by  uuid,
  is_read     boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_role     text;
  v_user_id  uuid := auth.uid();
BEGIN
  SELECT TRIM(role) INTO v_role FROM public.profiles WHERE id = v_user_id;

  RETURN QUERY
  SELECT
    n.id,
    n.title,
    n.message,
    n.created_at,
    n.created_by,
    (rs.read_at IS NOT NULL) AS is_read
  FROM public.admin_notifications n
  LEFT JOIN public.notification_read_status rs
         ON rs.notification_id = n.id
        AND rs.user_id = v_user_id
  WHERE
    (
      n.target_type = 'ROLE'
      AND v_role IS NOT NULL
      AND n.target_values @> ARRAY[v_role]::text[]
    )
    OR
    (
      n.target_type = 'USER'
      AND n.target_values @> ARRAY[v_user_id::text]::text[]
    )
  ORDER BY n.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- 3.3) Marcar lista de notificações como lidas (upsert)
CREATE OR REPLACE FUNCTION public.mark_notifications_as_read(
  p_notification_ids uuid[]
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_count   integer := 0;
BEGIN
  INSERT INTO public.notification_read_status (notification_id, user_id, read_at)
  SELECT unnest(p_notification_ids), v_user_id, now()
  ON CONFLICT (notification_id, user_id)
  DO UPDATE SET read_at = EXCLUDED.read_at;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- 3.4) Contador de não lidas (para badge do sino)
CREATE OR REPLACE FUNCTION public.get_my_unread_notifications_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_role     text;
  v_user_id  uuid := auth.uid();
  v_count    integer;
BEGIN
  SELECT TRIM(role) INTO v_role FROM public.profiles WHERE id = v_user_id;

  SELECT COUNT(*)::integer INTO v_count
  FROM public.admin_notifications n
  LEFT JOIN public.notification_read_status rs
         ON rs.notification_id = n.id
        AND rs.user_id = v_user_id
  WHERE
    (
      n.target_type = 'ROLE'
      AND v_role IS NOT NULL
      AND n.target_values @> ARRAY[v_role]::text[]
    )
    OR
    (
      n.target_type = 'USER'
      AND n.target_values @> ARRAY[v_user_id::text]::text[]
    )
    AND rs.id IS NULL;

  RETURN v_count;
END;
$$;

-- 4) Realtime seguro e idempotente
ALTER TABLE public.admin_notifications REPLICA IDENTITY FULL;
ALTER TABLE public.notification_read_status REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime FOR TABLE public.admin_notifications, public.notification_read_status;
  ELSE
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='admin_notifications'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='notification_read_status'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.notification_read_status';
    END IF;
  END IF;
END$$;
