-- Fix RLS policies for waiting_list table to avoid permission denied errors
-- Replace direct auth.users access with is_admin() function

-- Drop existing admin policies that access auth.users directly
DROP POLICY IF EXISTS "Admins can view all waiting list entries" ON public.waiting_list;
DROP POLICY IF EXISTS "Admins can manage all waiting list entries" ON public.waiting_list;

-- Recreate admin policies using is_admin() function
CREATE POLICY "Admins can view all waiting list entries" ON public.waiting_list
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage all waiting list entries" ON public.waiting_list
  FOR ALL USING (is_admin())
  WITH CHECK (is_admin());

-- Create a helper function to insert into waiting_list with proper security
-- This function uses SECURITY DEFINER to bypass RLS checks during insert
CREATE OR REPLACE FUNCTION public.add_to_waiting_list(
  p_learning_path_id uuid,
  p_formation_id uuid DEFAULT NULL,
  p_email text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_entry_id uuid;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to join waiting list';
  END IF;
  
  -- Validate that either learning_path_id or formation_id is provided
  IF p_learning_path_id IS NULL AND p_formation_id IS NULL THEN
    RAISE EXCEPTION 'Either learning_path_id or formation_id must be provided';
  END IF;
  
  -- Check if already on waitlist
  IF p_learning_path_id IS NOT NULL THEN
    SELECT id INTO v_entry_id
    FROM public.waiting_list
    WHERE user_id = v_user_id
      AND learning_path_id = p_learning_path_id;
  ELSE
    SELECT id INTO v_entry_id
    FROM public.waiting_list
    WHERE user_id = v_user_id
      AND formation_id = p_formation_id;
  END IF;
  
  IF v_entry_id IS NOT NULL THEN
    RETURN v_entry_id; -- Already on waitlist, return existing ID
  END IF;
  
  -- Insert new entry
  -- Use provided email or empty string (don't query auth.users to avoid permission issues)
  INSERT INTO public.waiting_list (user_id, learning_path_id, formation_id, email)
  VALUES (v_user_id, p_learning_path_id, p_formation_id, COALESCE(p_email, ''))
  RETURNING id INTO v_entry_id;
  
  RETURN v_entry_id;
EXCEPTION
  WHEN unique_violation THEN
    -- If somehow we get a unique violation, return the existing entry
    IF p_learning_path_id IS NOT NULL THEN
      SELECT id INTO v_entry_id
      FROM public.waiting_list
      WHERE user_id = v_user_id
        AND learning_path_id = p_learning_path_id;
    ELSE
      SELECT id INTO v_entry_id
      FROM public.waiting_list
      WHERE user_id = v_user_id
        AND formation_id = p_formation_id;
    END IF;
    RETURN v_entry_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.add_to_waiting_list TO authenticated;
