-- Fix advertisements RLS policies for admin panel

-- Drop the existing SELECT policy that only shows active ads
DROP POLICY IF EXISTS "Authenticated users can view active advertisements" ON public.advertisements;

-- Create new SELECT policies:
-- 1. Admins can see ALL advertisements (active and inactive)  
CREATE POLICY "Admins can view all advertisements" 
ON public.advertisements 
FOR SELECT 
USING (is_admin(auth.uid()));

-- 2. Regular users can see only active advertisements
CREATE POLICY "Users can view active advertisements" 
ON public.advertisements 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_active = true AND NOT is_admin(auth.uid()));

-- Ensure the is_admin function works correctly by recreating it with proper security
DROP FUNCTION IF EXISTS public.is_admin(uuid);

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND TRIM(role) = 'admin'
  );
$$;