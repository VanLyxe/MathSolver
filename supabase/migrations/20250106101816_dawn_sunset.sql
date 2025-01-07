/*
  # Storage bucket setup and policies

  1. Changes
    - Create math-problems storage bucket
    - Set up proper RLS policies for image uploads and access
    - Add file type and size restrictions
    - Enable public access for images

  2. Security
    - Only allow image file types
    - Restrict upload size to 5MB
    - Enable public read access
    - Restrict uploads to authenticated users
*/

-- Drop existing bucket if it exists
DO $$
BEGIN
    DELETE FROM storage.buckets WHERE id = 'math-problems';
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- Create the bucket with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'math-problems',
    'math-problems',
    true,
    5242880, -- 5MB limit
    ARRAY[
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ]
);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Create upload policy for authenticated users
CREATE POLICY "Users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'math-problems' AND
    (LOWER(storage.extension(name)) = 'png' OR
     LOWER(storage.extension(name)) = 'jpg' OR
     LOWER(storage.extension(name)) = 'jpeg' OR
     LOWER(storage.extension(name)) = 'gif' OR
     LOWER(storage.extension(name)) = 'webp') AND
    auth.role() = 'authenticated'
);

-- Create read policy for everyone
CREATE POLICY "Anyone can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'math-problems');

-- Create delete policy for owners
CREATE POLICY "Users can delete own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'math-problems' AND
    (storage.foldername(name))[1] = auth.uid()::text
);