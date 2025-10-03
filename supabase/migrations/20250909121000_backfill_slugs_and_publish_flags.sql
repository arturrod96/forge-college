WITH base_paths AS (
  SELECT id,
         COALESCE(NULLIF(lower(regexp_replace(title, '[^a-z0-9]+', '-', 'gi')), ''), 'path-' || substring(id::text, 1, 8)) AS base_slug
  FROM learning_paths
), ranked_paths AS (
  SELECT id,
         base_slug,
         ROW_NUMBER() OVER (PARTITION BY base_slug ORDER BY id) AS slug_rank
  FROM base_paths
)
UPDATE learning_paths lp
SET slug = CASE
      WHEN rp.slug_rank = 1 THEN rp.base_slug
      ELSE rp.base_slug || '-' || rp.slug_rank
    END,
    is_published = true,
    published_at = COALESCE(published_at, NOW())
FROM ranked_paths rp
WHERE lp.id = rp.id;

WITH base_courses AS (
  SELECT id,
         COALESCE(NULLIF(lower(regexp_replace(title, '[^a-z0-9]+', '-', 'gi')), ''), 'course-' || substring(id::text, 1, 8)) AS base_slug
  FROM courses
), ranked_courses AS (
  SELECT id,
         base_slug,
         ROW_NUMBER() OVER (PARTITION BY base_slug ORDER BY id) AS slug_rank
  FROM base_courses
)
UPDATE courses c
SET slug = CASE
      WHEN rc.slug_rank = 1 THEN rc.base_slug
      ELSE rc.base_slug || '-' || rc.slug_rank
    END,
    is_published = true,
    published_at = COALESCE(published_at, NOW())
FROM ranked_courses rc
WHERE c.id = rc.id;

WITH base_modules AS (
  SELECT id,
         COALESCE(NULLIF(lower(regexp_replace(title, '[^a-z0-9]+', '-', 'gi')), ''), 'module-' || substring(id::text, 1, 8)) AS base_slug
  FROM modules
), ranked_modules AS (
  SELECT id,
         base_slug,
         ROW_NUMBER() OVER (PARTITION BY base_slug ORDER BY id) AS slug_rank
  FROM base_modules
)
UPDATE modules m
SET slug = CASE
      WHEN rm.slug_rank = 1 THEN rm.base_slug
      ELSE rm.base_slug || '-' || rm.slug_rank
    END,
    is_published = true,
    published_at = COALESCE(published_at, NOW())
FROM ranked_modules rm
WHERE m.id = rm.id;

WITH base_lessons AS (
  SELECT id,
         COALESCE(NULLIF(lower(regexp_replace(title, '[^a-z0-9]+', '-', 'gi')), ''), 'lesson-' || substring(id::text, 1, 8)) AS base_slug
  FROM lessons
), ranked_lessons AS (
  SELECT id,
         base_slug,
         ROW_NUMBER() OVER (PARTITION BY base_slug ORDER BY id) AS slug_rank
  FROM base_lessons
)
UPDATE lessons l
SET slug = CASE
      WHEN rl.slug_rank = 1 THEN rl.base_slug
      ELSE rl.base_slug || '-' || rl.slug_rank
    END,
    is_published = true,
    published_at = COALESCE(published_at, NOW())
FROM ranked_lessons rl
WHERE l.id = rl.id;
