
-- Reescreve a RPC pública para retornar JSON aninhado (até 3 níveis)
CREATE OR REPLACE FUNCTION public.get_header_nav_items()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  result jsonb;
BEGIN
  /*
    Retorna um array JSON de itens de navegação visíveis.
    Cada item pai (parent_id IS NULL) vem com "children" ordenados por position.
    Suporta até 3 níveis (pai -> filho -> neto).
  */
  SELECT COALESCE(
    jsonb_agg(root_item ORDER BY (root_item->>'position')::int),
    '[]'::jsonb
  )
  INTO result
  FROM (
    SELECT jsonb_build_object(
      'id', p.id,
      'label', p.label,
      'type', p.type,
      'url', p.url,
      'page_slug', p.page_slug,
      'parent_id', p.parent_id,
      'is_visible', p.is_visible,
      'position', p.position,
      'created_at', p.created_at,
      'updated_at', p.updated_at,
      'children', (
        SELECT COALESCE(
          jsonb_agg(child_item ORDER BY (child_item->>'position')::int),
          '[]'::jsonb
        )
        FROM (
          SELECT jsonb_build_object(
            'id', c.id,
            'label', c.label,
            'type', c.type,
            'url', c.url,
            'page_slug', c.page_slug,
            'parent_id', c.parent_id,
            'is_visible', c.is_visible,
            'position', c.position,
            'created_at', c.created_at,
            'updated_at', c.updated_at,
            'children', (
              SELECT COALESCE(
                jsonb_agg(grand_item ORDER BY (grand_item->>'position')::int),
                '[]'::jsonb
              )
              FROM (
                SELECT jsonb_build_object(
                  'id', g.id,
                  'label', g.label,
                  'type', g.type,
                  'url', g.url,
                  'page_slug', g.page_slug,
                  'parent_id', g.parent_id,
                  'is_visible', g.is_visible,
                  'position', g.position,
                  'created_at', g.created_at,
                  'updated_at', g.updated_at,
                  'children', '[]'::jsonb
                ) AS grand_item
                FROM public.header_nav_items g
                WHERE g.parent_id = c.id
                  AND g.is_visible = true
              ) AS grand_items
            )
          ) AS child_item
          FROM public.header_nav_items c
          WHERE c.parent_id = p.id
            AND c.is_visible = true
        ) AS child_items
      )
    ) AS root_item
    FROM public.header_nav_items p
    WHERE p.parent_id IS NULL
      AND p.is_visible = true
  ) AS roots;

  RETURN result;
END;
$function$;
