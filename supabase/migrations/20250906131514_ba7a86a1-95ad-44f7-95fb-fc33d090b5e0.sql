-- Add deleted_at column to tools table for soft delete functionality
ALTER TABLE public.tools 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE NULL;

-- Create index for better performance when filtering deleted tools
CREATE INDEX idx_tools_deleted_at ON public.tools(deleted_at);

-- Drop and recreate the get_member_tools function to exclude deleted tools
DROP FUNCTION IF EXISTS public.get_member_tools();

CREATE OR REPLACE FUNCTION public.get_member_tools()
RETURNS TABLE(
  id integer, 
  name text, 
  description text, 
  category text, 
  is_active boolean, 
  is_maintenance boolean, 
  card_color text, 
  logo_url text, 
  access_url text, 
  email text, 
  password text, 
  cookies text, 
  slug text, 
  action_buttons jsonb, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone,
  deleted_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Retorna todas as ferramentas NÃO DELETADAS
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.description,
    t.category,
    t.is_active,
    t.is_maintenance,
    t.card_color,
    t.logo_url,
    t.access_url,
    t.email,
    t.password,
    t.cookies,
    t.slug,
    t.action_buttons,
    t.created_at,
    t.updated_at,
    t.deleted_at
  FROM public.tools t
  WHERE t.deleted_at IS NULL
  ORDER BY t.id ASC;
END;
$function$;

-- Create function to get deleted tools for trash management
CREATE OR REPLACE FUNCTION public.get_deleted_tools()
RETURNS TABLE(
  id integer, 
  name text, 
  description text, 
  category text, 
  is_active boolean, 
  is_maintenance boolean, 
  card_color text, 
  logo_url text, 
  access_url text, 
  email text, 
  password text, 
  cookies text, 
  slug text, 
  action_buttons jsonb, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone,
  deleted_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Verificar se é admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin permissions required.';
  END IF;

  -- Retorna apenas as ferramentas DELETADAS
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.description,
    t.category,
    t.is_active,
    t.is_maintenance,
    t.card_color,
    t.logo_url,
    t.access_url,
    t.email,
    t.password,
    t.cookies,
    t.slug,
    t.action_buttons,
    t.created_at,
    t.updated_at,
    t.deleted_at
  FROM public.tools t
  WHERE t.deleted_at IS NOT NULL
  ORDER BY t.deleted_at DESC;
END;
$function$;