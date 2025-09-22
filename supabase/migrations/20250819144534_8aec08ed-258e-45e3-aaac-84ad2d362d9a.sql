-- Update RLS policies for advertisements table to allow admin CRUD operations

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only admins can insert advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "Only admins can update advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "Only admins can delete advertisements" ON public.advertisements;

-- Create policies for admins to manage advertisements
CREATE POLICY "Only admins can insert advertisements" 
ON public.advertisements 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update advertisements" 
ON public.advertisements 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete advertisements" 
ON public.advertisements 
FOR DELETE 
USING (is_admin(auth.uid()));