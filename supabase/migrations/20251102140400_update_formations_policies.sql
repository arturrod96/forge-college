-- Update RLS policies for formations and formation_paths to allow any admin to manage records

-- Helper expression reused across policies
-- Note: PostgreSQL does not allow variable reuse, so we replicate the EXISTS clause in each policy

-- formations table policies
DROP POLICY IF EXISTS "Admins can delete formations" ON public.formations;
DROP POLICY IF EXISTS "Admins can update formations" ON public.formations;
DROP POLICY IF EXISTS "Admins can insert formations" ON public.formations;
DROP POLICY IF EXISTS "Formations are viewable by everyone" ON public.formations;

CREATE POLICY "Formations are viewable by everyone" ON public.formations
  FOR SELECT
  USING (
    is_published = true
    OR auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND coalesce(raw_user_meta_data->>'role', '') = 'admin'
    )
  );

CREATE POLICY "Admins can insert formations" ON public.formations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND coalesce(raw_user_meta_data->>'role', '') = 'admin'
    )
  );

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

-- formation_paths table policies
DROP POLICY IF EXISTS "Admins can delete formation paths" ON public.formation_paths;
DROP POLICY IF EXISTS "Admins can update formation paths" ON public.formation_paths;
DROP POLICY IF EXISTS "Admins can insert formation paths" ON public.formation_paths;
DROP POLICY IF EXISTS "Formation paths are viewable by everyone" ON public.formation_paths;

CREATE POLICY "Formation paths are viewable by everyone" ON public.formation_paths
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.formations AS f
      WHERE f.id = formation_paths.formation_id
        AND (
          f.is_published = true
          OR f.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
              AND coalesce(raw_user_meta_data->>'role', '') = 'admin'
          )
        )
    )
  );

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
