BEGIN;

ALTER TABLE public.profiles RENAME TO profiles_old;

CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address text,
  full_name text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  languages text[] NOT NULL DEFAULT '{}'::text[],
  years_experience integer NOT NULL DEFAULT 0 CHECK (years_experience >= 0),
  stacks text[] NOT NULL DEFAULT '{}'::text[],
  skills_to_develop text[] NOT NULL DEFAULT '{}'::text[],
  position_company text NOT NULL DEFAULT '',
  linkedin_url text,
  github_url text,
  communication_language text NOT NULL DEFAULT 'pt-BR' CHECK (communication_language IN ('pt-BR', 'en-US')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.profiles (
  user_id,
  wallet_address,
  created_at
)
SELECT
  old.id,
  old.wallet_address,
  old.created_at
FROM public.profiles_old AS old
WHERE EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id = old.id
);

DROP TABLE public.profiles_old;

CREATE OR REPLACE FUNCTION public.handle_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;

CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_profiles_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;

CREATE POLICY profiles_select_own
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY profiles_insert_own
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_admin());

CREATE POLICY profiles_update_own
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

COMMIT;
