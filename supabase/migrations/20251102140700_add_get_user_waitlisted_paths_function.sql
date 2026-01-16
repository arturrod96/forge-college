-- Create a function to get user's waitlisted learning paths
-- This function uses SECURITY DEFINER to bypass RLS issues
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
