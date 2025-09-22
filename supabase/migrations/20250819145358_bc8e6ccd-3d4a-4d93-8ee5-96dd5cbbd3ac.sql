-- Fix advertisements RLS policies for admin panel
-- Add policy for admins to see all advertisements (active and inactive)

-- Drop the existing SELECT policy that only shows active ads to all users
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