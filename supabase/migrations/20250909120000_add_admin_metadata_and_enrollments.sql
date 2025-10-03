BEGIN;

-- Extend learning_paths with admin metadata
ALTER TABLE learning_paths
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS learning_paths_slug_key ON learning_paths (slug);

-- Extend courses with metadata
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS courses_slug_key ON courses (slug);
CREATE INDEX IF NOT EXISTS courses_path_order_idx ON courses (path_id, "order");

-- Extend modules with metadata
ALTER TABLE modules
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS modules_slug_key ON modules (slug);
CREATE INDEX IF NOT EXISTS modules_course_order_idx ON modules (course_id, "order");

-- Extend lessons with metadata
ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS lessons_slug_key ON lessons (slug);
CREATE INDEX IF NOT EXISTS lessons_module_order_idx ON lessons (module_id, "order");

-- Enrollment table connecting users to learning paths
CREATE TABLE IF NOT EXISTS user_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, learning_path_id)
);

CREATE INDEX IF NOT EXISTS user_enrollments_user_idx ON user_enrollments (user_id);
CREATE INDEX IF NOT EXISTS user_enrollments_path_idx ON user_enrollments (learning_path_id);

-- Helper function to check admin privilege from JWT metadata
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'is_admin')::BOOLEAN, FALSE);
$$;

-- Audit trigger to keep timestamps and user ids in sync
CREATE OR REPLACE FUNCTION set_audit_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.created_by IS NULL AND auth.uid() IS NOT NULL THEN
      NEW.created_by := auth.uid();
    END IF;
    IF NEW.updated_by IS NULL AND auth.uid() IS NOT NULL THEN
      NEW.updated_by := auth.uid();
    END IF;
    NEW.updated_at := COALESCE(NEW.updated_at, NOW());
  ELSIF TG_OP = 'UPDATE' THEN
    IF auth.uid() IS NOT NULL THEN
      NEW.updated_by := auth.uid();
    END IF;
    NEW.updated_at := NOW();
  END IF;
  RETURN NEW;
END;
$$;

-- Attach audit triggers to content tables
CREATE TRIGGER set_learning_paths_audit_fields
BEFORE INSERT OR UPDATE ON learning_paths
FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER set_courses_audit_fields
BEFORE INSERT OR UPDATE ON courses
FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER set_modules_audit_fields
BEFORE INSERT OR UPDATE ON modules
FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER set_lessons_audit_fields
BEFORE INSERT OR UPDATE ON lessons
FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

COMMIT;
