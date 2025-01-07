/*
  # Fix users table foreign key constraint

  1. Changes
    - Create auth schema if it doesn't exist
    - Create auth.users table if it doesn't exist
    - Recreate public.users table with proper foreign key reference
    - Update RLS policies

  2. Security
    - Maintain RLS policies
    - Ensure proper foreign key constraints
*/

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create auth.users if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY,
  email TEXT
);

-- Recreate users table with proper reference
DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  tokens_remaining INTEGER DEFAULT 10,
  subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium')),
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "System can create users"
  ON public.users
  FOR INSERT
  TO authenticated, service_role
  WITH CHECK (true);

CREATE POLICY "Service role full access"
  ON public.users
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Recreate problems table with updated foreign key
DROP TABLE IF EXISTS public.problems CASCADE;
CREATE TABLE public.problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  problem_text TEXT NOT NULL,
  image_url TEXT,
  solution TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Enable RLS on problems table
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Create policy for problems table
CREATE POLICY "Users can CRUD own problems"
  ON public.problems
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Recreate token decrement function
CREATE OR REPLACE FUNCTION public.decrement_tokens()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_tokens INTEGER;
  updated_tokens INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non authentifié';
  END IF;

  SELECT tokens_remaining INTO current_tokens
  FROM public.users
  WHERE id = auth.uid();

  IF current_tokens IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non trouvé';
  END IF;

  IF current_tokens <= 0 THEN
    RETURN 0;
  END IF;

  UPDATE public.users
  SET tokens_remaining = tokens_remaining - 1
  WHERE id = auth.uid()
  RETURNING tokens_remaining INTO updated_tokens;

  RETURN updated_tokens;
END;
$$;