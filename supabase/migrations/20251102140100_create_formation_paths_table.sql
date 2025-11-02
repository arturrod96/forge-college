-- Create formation_paths association table (N:N relationship)
CREATE TABLE IF NOT EXISTS public.formation_paths (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  formation_id uuid NOT NULL,
  learning_path_id uuid NOT NULL,
  "order" integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT formation_paths_pkey PRIMARY KEY (id),
  CONSTRAINT formation_paths_formation_id_fkey FOREIGN KEY (formation_id) REFERENCES public.formations(id) ON DELETE CASCADE,
  CONSTRAINT formation_paths_learning_path_id_fkey FOREIGN KEY (learning_path_id) REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  CONSTRAINT formation_paths_unique_formation_path UNIQUE (formation_id, learning_path_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_formation_paths_formation_id ON public.formation_paths(formation_id);
CREATE INDEX IF NOT EXISTS idx_formation_paths_learning_path_id ON public.formation_paths(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_formation_paths_order ON public.formation_paths(formation_id, "order");

-- Enable RLS
ALTER TABLE public.formation_paths ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Formation paths are viewable by everyone" ON public.formation_paths
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.formations 
    WHERE formations.id = formation_paths.formation_id 
    AND (formations.is_published = true OR formations.created_by = auth.uid())
  ));

CREATE POLICY "Admins can insert formation paths" ON public.formation_paths
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.formations 
    WHERE formations.id = formation_paths.formation_id 
    AND formations.created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  ));

CREATE POLICY "Admins can update formation paths" ON public.formation_paths
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.formations 
    WHERE formations.id = formation_paths.formation_id 
    AND formations.created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  ));

CREATE POLICY "Admins can delete formation paths" ON public.formation_paths
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.formations 
    WHERE formations.id = formation_paths.formation_id 
    AND formations.created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  ));
