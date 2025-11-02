-- Add status column to learning_paths table
ALTER TABLE public.learning_paths 
ADD COLUMN IF NOT EXISTS status text;

-- Create enum type for learning path status
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'learning_path_status') THEN
    CREATE TYPE public.learning_path_status AS ENUM ('draft', 'published', 'coming_soon');
  END IF;
END $$;

-- Update existing data to use valid enum values
UPDATE public.learning_paths 
SET status = CASE 
  WHEN is_published = true THEN 'published'
  ELSE 'draft'
END
WHERE status IS NULL OR status NOT IN ('draft', 'published', 'coming_soon');

-- Alter column to use the enum type with explicit cast
ALTER TABLE public.learning_paths 
ALTER COLUMN status TYPE public.learning_path_status 
USING status::public.learning_path_status;

-- Set default with explicit cast
ALTER TABLE public.learning_paths 
ALTER COLUMN status SET DEFAULT 'draft'::public.learning_path_status;

-- Add check constraint for the enum
ALTER TABLE public.learning_paths 
ADD CONSTRAINT learning_paths_status_check 
CHECK (status = ANY (ARRAY['draft'::public.learning_path_status, 'published'::public.learning_path_status, 'coming_soon'::public.learning_path_status]));

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_learning_paths_status ON public.learning_paths(status);

-- Update RLS policies to consider the new status
DROP POLICY IF EXISTS "Learning paths are viewable by everyone" ON public.learning_paths;
CREATE POLICY "Learning paths are viewable by everyone" ON public.learning_paths
  FOR SELECT USING (status = 'published' OR auth.uid() = created_by);

-- Update insert policy to handle status
DROP POLICY IF EXISTS "Admins can insert learning paths" ON public.learning_paths;
CREATE POLICY "Admins can insert learning paths" ON public.learning_paths
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  ));
