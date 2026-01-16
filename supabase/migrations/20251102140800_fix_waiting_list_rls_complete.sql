-- Complete fix for waiting_list RLS policies
-- This migration ensures all policies are correct and allows proper access

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own waiting list entries" ON public.waiting_list;
DROP POLICY IF EXISTS "Users can insert their own waiting list entries" ON public.waiting_list;
DROP POLICY IF EXISTS "Users can update their own waiting list entries" ON public.waiting_list;
DROP POLICY IF EXISTS "Users can delete their own waiting list entries" ON public.waiting_list;
DROP POLICY IF EXISTS "Admins can view all waiting list entries" ON public.waiting_list;
DROP POLICY IF EXISTS "Admins can manage all waiting list entries" ON public.waiting_list;

-- Recreate user policies (these are the most important)
CREATE POLICY "Users can view their own waiting list entries" ON public.waiting_list
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own waiting list entries" ON public.waiting_list
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own waiting list entries" ON public.waiting_list
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own waiting list entries" ON public.waiting_list
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Recreate admin policies using is_admin() function
CREATE POLICY "Admins can view all waiting list entries" ON public.waiting_list
  FOR SELECT 
  USING (is_admin());

CREATE POLICY "Admins can manage all waiting list entries" ON public.waiting_list
  FOR ALL 
  USING (is_admin())
  WITH CHECK (is_admin());

-- Ensure the get_user_waitlisted_paths function exists and has correct permissions
CREATE OR REPLACE FUNCTION public.get_user_waitlisted_paths()
RETURNS TABLE(learning_path_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT wl.learning_path_id
  FROM public.waiting_list wl
  WHERE wl.user_id = auth.uid()
    AND wl.learning_path_id IS NOT NULL;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_waitlisted_paths TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_waitlisted_paths TO anon;

-- Ensure add_to_waiting_list function has correct permissions
GRANT EXECUTE ON FUNCTION public.add_to_waiting_list TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_to_waiting_list TO anon;
