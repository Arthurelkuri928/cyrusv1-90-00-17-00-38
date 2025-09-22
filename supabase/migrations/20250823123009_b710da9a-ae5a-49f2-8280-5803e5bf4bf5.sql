-- CORREÇÃO DOS WARNINGS DE SEGURANÇA RESTANTES

-- Atualizar funções que ainda não têm search_path configurado corretamente

-- 1. Atualizar função update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- 2. Atualizar função update_page_visibility_updated_at
CREATE OR REPLACE FUNCTION public.update_page_visibility_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 3. Atualizar função update_pages_updated_at
CREATE OR REPLACE FUNCTION public.update_pages_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 4. Atualizar função update_advertisements_updated_at
CREATE OR REPLACE FUNCTION public.update_advertisements_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 5. Atualizar função update_tools_updated_at
CREATE OR REPLACE FUNCTION public.update_tools_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 6. Atualizar função update_sidebar_links_updated_at
CREATE OR REPLACE FUNCTION public.update_sidebar_links_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 7. Atualizar função cleanup_tool_data
CREATE OR REPLACE FUNCTION public.cleanup_tool_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Delete related tool credentials
  DELETE FROM public.tool_credentials WHERE tool_id = OLD.id::text;
  RETURN OLD;
END;
$function$;