
-- Create functions for header settings management
CREATE OR REPLACE FUNCTION get_header_settings()
RETURNS SETOF public.header_settings
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT * FROM public.header_settings ORDER BY created_at DESC LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION create_default_header_settings()
RETURNS SETOF public.header_settings
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  INSERT INTO public.header_settings (logo_url) 
  VALUES (null)
  RETURNING *;
$$;

CREATE OR REPLACE FUNCTION update_header_settings(logo_url_param text)
RETURNS SETOF public.header_settings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Get existing settings
  IF EXISTS (SELECT 1 FROM public.header_settings) THEN
    -- Update existing
    RETURN QUERY
    UPDATE public.header_settings 
    SET logo_url = logo_url_param, updated_at = now()
    RETURNING *;
  ELSE
    -- Create new
    RETURN QUERY
    INSERT INTO public.header_settings (logo_url)
    VALUES (logo_url_param)
    RETURNING *;
  END IF;
END;
$$;

-- Create functions for action buttons management
CREATE OR REPLACE FUNCTION get_header_action_buttons()
RETURNS SETOF public.header_action_buttons
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT * FROM public.header_action_buttons ORDER BY position ASC;
$$;

CREATE OR REPLACE FUNCTION create_header_action_button(
  label_param text,
  url_param text,
  style_param text,
  is_visible_param boolean DEFAULT true,
  position_param integer DEFAULT 0
)
RETURNS SETOF public.header_action_buttons
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  INSERT INTO public.header_action_buttons (label, url, style, is_visible, position)
  VALUES (label_param, url_param, style_param, is_visible_param, position_param)
  RETURNING *;
$$;

CREATE OR REPLACE FUNCTION update_header_action_button(
  button_id uuid,
  label_param text DEFAULT NULL,
  url_param text DEFAULT NULL,
  style_param text DEFAULT NULL,
  is_visible_param boolean DEFAULT NULL,
  position_param integer DEFAULT NULL
)
RETURNS SETOF public.header_action_buttons
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  UPDATE public.header_action_buttons 
  SET 
    label = COALESCE(label_param, label),
    url = COALESCE(url_param, url),
    style = COALESCE(style_param, style),
    is_visible = COALESCE(is_visible_param, is_visible),
    position = COALESCE(position_param, position),
    updated_at = now()
  WHERE id = button_id
  RETURNING *;
END;
$$;

CREATE OR REPLACE FUNCTION delete_header_action_button(button_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  DELETE FROM public.header_action_buttons WHERE id = button_id;
$$;

-- Create functions for navigation items management
CREATE OR REPLACE FUNCTION get_header_nav_items()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Get all nav items and build hierarchical structure
  WITH RECURSIVE nav_tree AS (
    -- Root items
    SELECT 
      id, label, type, url, page_slug, parent_id, is_visible, position,
      created_at, updated_at,
      jsonb_build_array() as children,
      0 as level
    FROM public.header_nav_items 
    WHERE parent_id IS NULL AND is_visible = true
    
    UNION ALL
    
    -- Child items
    SELECT 
      ni.id, ni.label, ni.type, ni.url, ni.page_slug, ni.parent_id, ni.is_visible, ni.position,
      ni.created_at, ni.updated_at,
      jsonb_build_array() as children,
      nt.level + 1
    FROM public.header_nav_items ni
    JOIN nav_tree nt ON ni.parent_id = nt.id
    WHERE ni.is_visible = true
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
      'updated_at', updated_at,
      'children', children
    ) ORDER BY position
  ) INTO result
  FROM nav_tree
  WHERE level = 0;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION create_header_nav_item(
  label_param text,
  type_param text,
  url_param text DEFAULT NULL,
  page_slug_param text DEFAULT NULL,
  parent_id_param uuid DEFAULT NULL,
  is_visible_param boolean DEFAULT true,
  position_param integer DEFAULT 0
)
RETURNS SETOF public.header_nav_items
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  INSERT INTO public.header_nav_items (label, type, url, page_slug, parent_id, is_visible, position)
  VALUES (label_param, type_param, url_param, page_slug_param, parent_id_param, is_visible_param, position_param)
  RETURNING *;
$$;

CREATE OR REPLACE FUNCTION update_header_nav_item(
  item_id uuid,
  label_param text DEFAULT NULL,
  type_param text DEFAULT NULL,
  url_param text DEFAULT NULL,
  page_slug_param text DEFAULT NULL,
  parent_id_param uuid DEFAULT NULL,
  is_visible_param boolean DEFAULT NULL,
  position_param integer DEFAULT NULL
)
RETURNS SETOF public.header_nav_items
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  UPDATE public.header_nav_items 
  SET 
    label = COALESCE(label_param, label),
    type = COALESCE(type_param, type),
    url = COALESCE(url_param, url),
    page_slug = COALESCE(page_slug_param, page_slug),
    parent_id = COALESCE(parent_id_param, parent_id),
    is_visible = COALESCE(is_visible_param, is_visible),
    position = COALESCE(position_param, position),
    updated_at = now()
  WHERE id = item_id
  RETURNING *;
END;
$$;

CREATE OR REPLACE FUNCTION delete_header_nav_item(item_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  DELETE FROM public.header_nav_items WHERE id = item_id;
$$;
