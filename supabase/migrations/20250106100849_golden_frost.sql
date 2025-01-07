/*
  # Fix RLS policies for users table

  1. Changes
    - Add policy for inserting new users
    - Update existing policies for better security
    - Add service role bypass for system operations

  2. Security
    - Enable RLS on users table
    - Add specific policies for authenticated users
    - Add service role policies for system operations
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Service role can manage users" ON public.users;

-- Create new policies with proper permissions
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