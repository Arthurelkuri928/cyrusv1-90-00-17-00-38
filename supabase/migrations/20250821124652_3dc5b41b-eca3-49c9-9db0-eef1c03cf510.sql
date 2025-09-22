
-- Function to list users with subscription information (for admins only)
CREATE OR REPLACE FUNCTION public.list_users_with_subscriptions(
  search_term text DEFAULT '',
  page_limit integer DEFAULT 50,
  page_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  email text,
  role text,
  subscription_status text,
  subscription_type text,
  subscription_end_at timestamp with time zone,
  created_at timestamp without time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Only admins can list users.';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    au.email,
    p.role,
    p.subscription_status,
    p.subscription_type,
    p.subscription_end_at,
    p.created_at,
    p.updated_at
  FROM profiles p
  JOIN auth.users au ON p.id = au.id
  WHERE 
    (search_term = '' OR 
     au.email ILIKE '%' || search_term || '%' OR
     p.role ILIKE '%' || search_term || '%')
  ORDER BY p.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$function$;

-- Function to count users for pagination
CREATE OR REPLACE FUNCTION public.count_users_with_subscriptions(
  search_term text DEFAULT ''
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  user_count integer;
BEGIN
  -- Check if caller is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Only admins can count users.';
  END IF;

  SELECT COUNT(*)::integer INTO user_count
  FROM profiles p
  JOIN auth.users au ON p.id = au.id
  WHERE 
    (search_term = '' OR 
     au.email ILIKE '%' || search_term || '%' OR
     p.role ILIKE '%' || search_term || '%');

  RETURN user_count;
END;
$function$;
