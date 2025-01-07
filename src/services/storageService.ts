import { supabase } from '../lib/supabase';

export const storageService = {
  async uploadImage(file: File): Promise<string | null> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('L\'image ne doit pas dépasser 5MB');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const filePath = `${userId}/${fileName}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('math-problems')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('math-problems')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Erreur service storage:', error);
      return null;
    }
  },

  async deleteImage(url: string): Promise<boolean> {
    try {
      const path = url.split('/').pop();
      if (!path) return false;

      const { error } = await supabase.storage
        .from('math-problems')
        .remove([path]);

      return !error;
    } catch (error) {
      console.error('Erreur suppression image:', error);
      return false;
    }
  }
};