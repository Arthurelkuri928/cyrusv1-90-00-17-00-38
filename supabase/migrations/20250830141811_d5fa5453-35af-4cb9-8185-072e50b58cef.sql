-- Create admin function to get all header nav items (including invisible ones)
CREATE OR REPLACE FUNCTION public.get_header_nav_items_admin()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result JSONB;
BEGIN
  -- Check if caller has admin permissions
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin permissions required.';
  END IF;

  WITH RECURSIVE nav_tree AS (
    -- Root items (sem parent)
    SELECT 
      id, label, type, url, page_slug, parent_id, is_visible, position,
      created_at, updated_at,
      ARRAY[]::UUID[] as path,
      0 as level
    FROM public.header_nav_items 
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Child items
    SELECT 
      n.id, n.label, n.type, n.url, n.page_slug, n.parent_id, n.is_visible, n.position,
      n.created_at, n.updated_at,
      nt.path || nt.id,
      nt.level + 1
    FROM public.header_nav_items n
    JOIN nav_tree nt ON n.parent_id = nt.id
    WHERE nt.level < 3 -- Evitar recursão infinita
  )
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'label', label,
      'type', type,
      'url', url,
      'page_slug', page_slug,
      'parent_id', parent_id,
      'is_visible', is_visible,
      'position', position,
      'created_at', created_at,
      'updated_at', updated_at
    ) ORDER BY position
  ) INTO result
  FROM nav_tree;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$function$;