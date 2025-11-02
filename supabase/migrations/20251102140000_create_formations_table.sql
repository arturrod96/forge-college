-- Create formations table
CREATE TABLE IF NOT EXISTS public.formations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  slug text,
  thumbnail_url text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid,
  CONSTRAINT formations_pkey PRIMARY KEY (id),
  CONSTRAINT formations_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT formations_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_formations_slug ON public.formations(slug);

-- Create index on published status
CREATE INDEX IF NOT EXISTS idx_formations_published ON public.formations(is_published);

-- Enable RLS
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Formations are viewable by everyone" ON public.formations
  FOR SELECT USING (is_published = true OR auth.uid() = created_by);

CREATE POLICY "Admins can insert formations" ON public.formations
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  ));

CREATE POLICY "Admins can update formations" ON public.formations
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = created_by 
    AND (raw_user_meta_data->>'role' = 'admin' OR raw_user_meta_data->>'role' = 'admin')
  ));

CREATE POLICY "Admins can delete formations" ON public.formations
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = created_by 
    AND raw_user_meta_data->>'role' = 'admin'
  ));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_formations_updated_at
  BEFORE UPDATE ON public.formations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
