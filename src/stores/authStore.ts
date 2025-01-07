import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
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

      const { error: dbError } = await authService.createUser(
        session.user.id,
        session.user.email || ''
      );

      if (dbError) {
        console.error('Database error:', dbError);
        set({ user: null, loading: false });
        return;
      }

      set({ user: session.user, loading: false });
    } catch (error) {
      console.error('Auth error:', error);
      set({ user: null, loading: false });
    }
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    try {
      // Vérifier d'abord le mot de passe actuel en essayant de se connecter
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: useAuthStore.getState().user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Mot de passe actuel incorrect');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Password update error:', error);
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (!data?.user) {
        throw new Error('Aucune donnée utilisateur reçue');
      }

      set({ user: data.user });
      toast.success('Connexion réussie !');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Erreur lors de la connexion');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      if (!data?.user) throw new Error('Aucune donnée utilisateur reçue');

      const { error: dbError } = await authService.createUser(data.user.id, email);
      if (dbError) throw dbError;

      set({ user: data.user });
      toast.success('Inscription réussie !');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Erreur lors de l\'inscription');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await supabase.auth.signOut();
      set({ user: null });
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Erreur lors de la déconnexion');
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));