import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

export type UserResponse = {
  user: Database['public']['Tables']['users']['Row'] | null;
  error: Error | null;
};

export const authService = {
  async createUser(userId: string, email: string): Promise<UserResponse> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select()
        .eq('id', userId)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      if (existingUser) {
        return { user: existingUser, error: null };
      }

      // Créer l'utilisateur avec 1 token initial
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email,
            tokens_remaining: 1,
            subscription_type: 'free'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return { user: data, error: null };
    } catch (error) {
      console.error('Error in createUser:', error);
      return { user: null, error: error as Error };
    }
  },

  async getUser(userId: string): Promise<UserResponse> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { user: data, error: null };
    } catch (error) {
      console.error('Error in getUser:', error);
      return { user: null, error: error as Error };
    }
  },
};