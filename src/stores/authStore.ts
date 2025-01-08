import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

interface AuthState {
  user: (User & { subscription_type?: string }) | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  checkUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  
  checkUser: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        set({ user: null, loading: false });
        return;
      }

      const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('subscription_type')
        .eq('id', session.user.id)
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        set({ user: null, loading: false });
        return;
      }

      const enrichedUser = {
        ...session.user,
        subscription_type: userData?.subscription_type
      };

      set({ user: enrichedUser, loading: false });
    } catch (error) {
      console.error('Auth error:', error);
      set({ user: null, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      await authService.getUser(data.user.id);
      set({ user: data.user });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;
      if (data.user) {
        await authService.createUser(data.user.id, email);
        set({ user: data.user });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      toast.success('Mot de passe mis à jour avec succès');
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  }
}));
