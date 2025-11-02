BEGIN;

-- Add status to formations using existing learning_path_status enum
ALTER TABLE public.formations
  ADD COLUMN IF NOT EXISTS status public.learning_path_status;

UPDATE public.formations
SET status = CASE
  WHEN is_published = true THEN 'published'::public.learning_path_status
  ELSE 'draft'::public.learning_path_status
END
WHERE status IS NULL;

ALTER TABLE public.formations
  ALTER COLUMN status SET DEFAULT 'draft'::public.learning_path_status;

CREATE INDEX IF NOT EXISTS idx_formations_status ON public.formations(status);

-- Ensure is_published matches status for formations
UPDATE public.formations
SET is_published = CASE
  WHEN status IN ('published', 'coming_soon') THEN true
  ELSE false
END;

-- Add status to courses
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS status public.learning_path_status;

UPDATE public.courses
SET status = CASE
  WHEN is_published = true THEN 'published'::public.learning_path_status
  ELSE 'draft'::public.learning_path_status
END
WHERE status IS NULL;

ALTER TABLE public.courses
  ALTER COLUMN status SET DEFAULT 'draft'::public.learning_path_status;

CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);

-- Ensure is_published matches status for courses
UPDATE public.courses
SET is_published = CASE
  WHEN status IN ('published', 'coming_soon') THEN true
  ELSE false
END;

-- Refresh learning path visibility policy to include coming soon
DROP POLICY IF EXISTS "Learning paths are viewable by everyone" ON public.learning_paths;
CREATE POLICY "Learning paths are viewable by everyone" ON public.learning_paths
  FOR SELECT USING (
    status IN ('published', 'coming_soon')
    OR auth.uid() = created_by
  );

-- Update formations policies to rely on status instead of boolean flag
DROP POLICY IF EXISTS "Formations are viewable by everyone" ON public.formations;
CREATE POLICY "Formations are viewable by everyone" ON public.formations
  FOR SELECT
  USING (
    status IN ('published', 'coming_soon')
    OR auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND coalesce(raw_user_meta_data->>'role', '') = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can insert formations" ON public.formations;
CREATE POLICY "Admins can insert formations" ON public.formations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND coalesce(raw_user_meta_data->>'role', '') = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update formations" ON public.formations;
CREATE POLICY "Admins can update formations" ON public.formations
  FOR UPDATE
  USING (
    auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND coalesce(raw_user_meta_data->>'role', '') = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND coalesce(raw_user_meta_data->>'role', '') = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete formations" ON public.formations;
CREATE POLICY "Admins can delete formations" ON public.formations
  FOR DELETE
  USING (
    auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND coalesce(raw_user_meta_data->>'role', '') = 'admin'
    )
  );

-- Update formation_paths policy to respect formation status visibility
DROP POLICY IF EXISTS "Formation paths are viewable by everyone" ON public.formation_paths;
CREATE POLICY "Formation paths are viewable by everyone" ON public.formation_paths
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.formations AS f
      WHERE f.id = formation_paths.formation_id
        AND (
          f.status IN ('published', 'coming_soon')
          OR f.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
              AND coalesce(raw_user_meta_data->>'role', '') = 'admin'
          )
        )
    )
  );

DROP POLICY IF EXISTS "Admins can insert formation paths" ON public.formation_paths;
CREATE POLICY "Admins can insert formation paths" ON public.formation_paths
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.formations AS f
      WHERE f.id = formation_paths.formation_id
        AND (
          f.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
              AND coalesce(raw_user_meta_data->>'role', '') = 'admin'
          )
        )
    )
  );

DROP POLICY IF EXISTS "Admins can update formation paths" ON public.formation_paths;
CREATE POLICY "Admins can update formation paths" ON public.formation_paths
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.formations AS f
      WHERE f.id = formation_paths.formation_id
        AND (
          f.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
              AND coalesce(raw_user_meta_data->>'role', '') = 'admin'
          )
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.formations AS f
      WHERE f.id = formation_paths.formation_id
        AND (
          f.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
              AND coalesce(raw_user_meta_data->>'role', '') = 'admin'
          )
        )
    )
  );

DROP POLICY IF EXISTS "Admins can delete formation paths" ON public.formation_paths;
CREATE POLICY "Admins can delete formation paths" ON public.formation_paths
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.formations AS f
      WHERE f.id = formation_paths.formation_id
        AND (
          f.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
              AND coalesce(raw_user_meta_data->>'role', '') = 'admin'
          )
        )
    )
  );

-- Update courses visibility policy for coming soon state
DROP POLICY IF EXISTS courses_select_published ON public.courses;
CREATE POLICY courses_select_visible ON public.courses
  FOR SELECT
  USING (
    status IN ('published', 'coming_soon')
    AND EXISTS (
      SELECT 1 FROM public.learning_paths lp
      WHERE lp.id = courses.path_id
        AND lp.status IN ('published', 'coming_soon')
    )
  );

COMMIT;
