BEGIN;

-- Enable RLS on content tables
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies for learning_paths
CREATE POLICY learning_paths_select_published
  ON learning_paths
  FOR SELECT
  USING (is_published = true);

CREATE POLICY learning_paths_admin_all
  ON learning_paths
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policies for courses
CREATE POLICY courses_select_published
  ON courses
  FOR SELECT
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1
      FROM learning_paths lp
      WHERE lp.id = courses.path_id
        AND lp.is_published = true
    )
  );

CREATE POLICY courses_admin_all
  ON courses
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policies for modules
CREATE POLICY modules_select_published
  ON modules
  FOR SELECT
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1
      FROM courses c
      JOIN learning_paths lp ON lp.id = c.path_id
      WHERE c.id = modules.course_id
        AND c.is_published = true
        AND lp.is_published = true
    )
  );

CREATE POLICY modules_admin_all
  ON modules
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policies for lessons
CREATE POLICY lessons_select_published
  ON lessons
  FOR SELECT
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1
      FROM modules m
      JOIN courses c ON c.id = m.course_id
      JOIN learning_paths lp ON lp.id = c.path_id
      WHERE m.id = lessons.module_id
        AND m.is_published = true
        AND c.is_published = true
        AND lp.is_published = true
    )
  );

CREATE POLICY lessons_admin_all
  ON lessons
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policies for user_enrollments
CREATE POLICY user_enrollments_owner_rw
  ON user_enrollments
  FOR ALL
  USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

-- Policies for user_progress
CREATE POLICY user_progress_owner_rw
  ON user_progress
  FOR ALL
  USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

COMMIT;
