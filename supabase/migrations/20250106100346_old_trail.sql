/*
  # Initial Schema Setup

  1. Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text)
      - `tokens_remaining` (integer)
      - `subscription_type` (text)
      - `subscription_end_date` (timestamptz)
      - `created_at` (timestamptz)
    - `problems`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `problem_text` (text)
      - `image_url` (text)
      - `solution` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Add policies for problem data access
*/

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  tokens_remaining INTEGER DEFAULT 10,
  subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium')),
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Problems table
CREATE TABLE IF NOT EXISTS public.problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  problem_text TEXT NOT NULL,
  image_url TEXT,
  solution TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Policies for users table
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

CREATE POLICY "Service role can manage users"
  ON public.users
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policies for problems table
CREATE POLICY "Users can CRUD own problems"
  ON public.problems
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function for decrementing tokens
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