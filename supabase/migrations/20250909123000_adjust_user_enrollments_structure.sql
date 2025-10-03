BEGIN;

-- Ensure mandatory relationships
UPDATE user_enrollments SET user_id = '00000000-0000-0000-0000-000000000000'
WHERE user_id IS NULL;
UPDATE user_enrollments SET learning_path_id = (SELECT id FROM learning_paths LIMIT 1)
WHERE learning_path_id IS NULL;

ALTER TABLE user_enrollments
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN learning_path_id SET NOT NULL;

-- Rename enrolled_at to created_at if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'user_enrollments'
      AND column_name = 'enrolled_at'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE user_enrollments RENAME COLUMN enrolled_at TO created_at;
  END IF;
END $$;

ALTER TABLE user_enrollments
  ALTER COLUMN created_at SET DEFAULT NOW();

UPDATE user_enrollments SET created_at = NOW()
WHERE created_at IS NULL;

ALTER TABLE user_enrollments
  ALTER COLUMN created_at SET NOT NULL;

UPDATE user_enrollments SET is_active = true
WHERE is_active IS NULL;

ALTER TABLE user_enrollments
  ALTER COLUMN is_active SET DEFAULT true,
  ALTER COLUMN is_active SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS user_enrollments_unique_user_path
  ON user_enrollments (user_id, learning_path_id);

COMMIT;
