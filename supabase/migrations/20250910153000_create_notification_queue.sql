BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_status') THEN
    CREATE TYPE notification_status AS ENUM ('pending', 'processing', 'sent', 'failed');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.notification_queue (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status notification_status NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  scheduled_for timestamptz NOT NULL DEFAULT NOW(),
  last_error text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT notification_queue_template_check CHECK (
    template IN ('generic-notification', 'path-enrollment')
  )
);

CREATE INDEX IF NOT EXISTS notification_queue_status_scheduled_idx
  ON public.notification_queue (status, scheduled_for);

CREATE INDEX IF NOT EXISTS notification_queue_user_idx
  ON public.notification_queue (user_id);

CREATE OR REPLACE FUNCTION public.notification_queue_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notification_queue_set_updated_at ON public.notification_queue;

CREATE TRIGGER notification_queue_set_updated_at
BEFORE UPDATE ON public.notification_queue
FOR EACH ROW
EXECUTE FUNCTION public.notification_queue_set_updated_at();

CREATE OR REPLACE FUNCTION public.enqueue_path_enrollment_notification()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  path_title text;
  path_description text;
  path_slug text;
  courses_count integer := 0;
  modules_count integer := 0;
BEGIN
  SELECT
    lp.title,
    lp.description,
    lp.slug,
    COUNT(DISTINCT c.id) AS courses_count,
    COUNT(DISTINCT m.id) AS modules_count
  INTO
    path_title,
    path_description,
    path_slug,
    courses_count,
    modules_count
  FROM public.learning_paths lp
  LEFT JOIN public.courses c ON c.path_id = lp.id AND c.is_published = true
  LEFT JOIN public.modules m ON m.course_id = c.id AND m.is_published = true
  WHERE lp.id = NEW.learning_path_id
  GROUP BY lp.id;

  INSERT INTO public.notification_queue (user_id, template, payload)
  VALUES (
    NEW.user_id,
    'path-enrollment',
    jsonb_strip_nulls(
      jsonb_build_object(
        'enrollmentId', NEW.id,
        'learningPathId', NEW.learning_path_id,
        'pathTitle', path_title,
        'pathDescription', path_description,
        'pathSlug', path_slug,
        'coursesCount', courses_count,
        'modulesCount', modules_count
      )
    )
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_enrollments_enqueue_notification ON public.user_enrollments;

CREATE TRIGGER user_enrollments_enqueue_notification
AFTER INSERT ON public.user_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.enqueue_path_enrollment_notification();

COMMIT;
