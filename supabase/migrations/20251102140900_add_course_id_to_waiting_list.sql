-- Add course_id column to waiting_list table
ALTER TABLE public.waiting_list
ADD COLUMN IF NOT EXISTS course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE;

-- Update the check constraint to allow course_id
ALTER TABLE public.waiting_list
DROP CONSTRAINT IF EXISTS waiting_list_check_either_path_or_formation;

ALTER TABLE public.waiting_list
ADD CONSTRAINT waiting_list_check_one_resource CHECK (
  (learning_path_id IS NOT NULL AND formation_id IS NULL AND course_id IS NULL) OR 
  (learning_path_id IS NULL AND formation_id IS NOT NULL AND course_id IS NULL) OR
  (learning_path_id IS NULL AND formation_id IS NULL AND course_id IS NOT NULL)
);

-- Add unique constraint for course_id
ALTER TABLE public.waiting_list
ADD CONSTRAINT waiting_list_unique_user_course UNIQUE (user_id, course_id);

-- Create index for course_id
CREATE INDEX IF NOT EXISTS idx_waiting_list_course_id ON public.waiting_list(course_id);

-- Update add_to_waiting_list function to support course_id
CREATE OR REPLACE FUNCTION public.add_to_waiting_list(
  p_learning_path_id uuid DEFAULT NULL,
  p_formation_id uuid DEFAULT NULL,
  p_course_id uuid DEFAULT NULL,
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
  
  -- Validate that exactly one resource ID is provided
  IF (p_learning_path_id IS NULL AND p_formation_id IS NULL AND p_course_id IS NULL) OR
     (CASE WHEN p_learning_path_id IS NOT NULL THEN 1 ELSE 0 END +
      CASE WHEN p_formation_id IS NOT NULL THEN 1 ELSE 0 END +
      CASE WHEN p_course_id IS NOT NULL THEN 1 ELSE 0 END) > 1 THEN
    RAISE EXCEPTION 'Exactly one of learning_path_id, formation_id, or course_id must be provided';
  END IF;
  
  -- Check if already on waitlist
  IF p_learning_path_id IS NOT NULL THEN
    SELECT id INTO v_entry_id
    FROM public.waiting_list
    WHERE user_id = v_user_id
      AND learning_path_id = p_learning_path_id;
  ELSIF p_formation_id IS NOT NULL THEN
    SELECT id INTO v_entry_id
    FROM public.waiting_list
    WHERE user_id = v_user_id
      AND formation_id = p_formation_id;
  ELSIF p_course_id IS NOT NULL THEN
    SELECT id INTO v_entry_id
    FROM public.waiting_list
    WHERE user_id = v_user_id
      AND course_id = p_course_id;
  END IF;
  
  IF v_entry_id IS NOT NULL THEN
    RETURN v_entry_id; -- Already on waitlist, return existing ID
  END IF;
  
  -- Insert new entry
  INSERT INTO public.waiting_list (user_id, learning_path_id, formation_id, course_id, email)
  VALUES (v_user_id, p_learning_path_id, p_formation_id, p_course_id, COALESCE(p_email, ''))
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
    ELSIF p_formation_id IS NOT NULL THEN
      SELECT id INTO v_entry_id
      FROM public.waiting_list
      WHERE user_id = v_user_id
        AND formation_id = p_formation_id;
    ELSIF p_course_id IS NOT NULL THEN
      SELECT id INTO v_entry_id
      FROM public.waiting_list
      WHERE user_id = v_user_id
        AND course_id = p_course_id;
    END IF;
    RETURN v_entry_id;
END;
$$;

-- Create function to get waiting list count for a course
CREATE OR REPLACE FUNCTION public.get_course_waiting_list_count(p_course_id uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM public.waiting_list 
    WHERE course_id = p_course_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.add_to_waiting_list TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_course_waiting_list_count TO authenticated;
