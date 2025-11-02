-- Create waiting_list table
CREATE TABLE IF NOT EXISTS public.waiting_list (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  learning_path_id uuid,
  formation_id uuid,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT waiting_list_pkey PRIMARY KEY (id),
  CONSTRAINT waiting_list_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT waiting_list_learning_path_id_fkey FOREIGN KEY (learning_path_id) REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  CONSTRAINT waiting_list_formation_id_fkey FOREIGN KEY (formation_id) REFERENCES public.formations(id) ON DELETE CASCADE,
  CONSTRAINT waiting_list_check_either_path_or_formation CHECK (
    (learning_path_id IS NOT NULL AND formation_id IS NULL) OR 
    (learning_path_id IS NULL AND formation_id IS NOT NULL)
  ),
  CONSTRAINT waiting_list_unique_user_path UNIQUE (user_id, learning_path_id),
  CONSTRAINT waiting_list_unique_user_formation UNIQUE (user_id, formation_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_waiting_list_user_id ON public.waiting_list(user_id);
CREATE INDEX IF NOT EXISTS idx_waiting_list_learning_path_id ON public.waiting_list(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_waiting_list_formation_id ON public.waiting_list(formation_id);
CREATE INDEX IF NOT EXISTS idx_waiting_list_email ON public.waiting_list(email);

-- Enable RLS
ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own waiting list entries" ON public.waiting_list
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own waiting list entries" ON public.waiting_list
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own waiting list entries" ON public.waiting_list
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own waiting list entries" ON public.waiting_list
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all waiting list entries" ON public.waiting_list
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  ));

CREATE POLICY "Admins can manage all waiting list entries" ON public.waiting_list
  FOR ALL USING (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  ));

-- Create function to get waiting list count for a learning path
CREATE OR REPLACE FUNCTION public.get_waiting_list_count(p_learning_path_id uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM public.waiting_list 
    WHERE learning_path_id = p_learning_path_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get waiting list count for a formation
CREATE OR REPLACE FUNCTION public.get_formation_waiting_list_count(p_formation_id uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM public.waiting_list 
    WHERE formation_id = p_formation_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_waiting_list_count TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_formation_waiting_list_count TO authenticated;
