-- Add optional localized titles for courses (en-US, pt-BR).
-- When set, the app shows the title for the user's language; otherwise falls back to title.
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS title_pt_br text;

-- Backfill: treat existing title as Portuguese so pt-BR locale keeps current text
UPDATE public.courses
SET title_pt_br = COALESCE(title_pt_br, title)
WHERE title_pt_br IS NULL AND title IS NOT NULL;

COMMENT ON COLUMN public.courses.title_en IS 'Course title in English (en-US). Shown when app language is English.';
COMMENT ON COLUMN public.courses.title_pt_br IS 'Course title in Portuguese (pt-BR). Shown when app language is Portuguese.';

-- Example: set English title for known DeFi course so it shows in English when locale is en
UPDATE public.courses
SET title_en = 'Introduction to Decentralized Finance (DeFi)'
WHERE title ILIKE '%Introdução a Finanças Descentralizadas%' AND (title_en IS NULL OR title_en = '');
