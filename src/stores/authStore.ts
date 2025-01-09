import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

interface AuthState {
  user: (User & { subscription_type?: string; tokens_remaining?: number }) | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  checkUser: () => Promise<void>;
  updateUserTokens: (newTokenCount: number) => Promise<void>;
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
        .select('subscription_type, tokens_remaining')
        .eq('id', session.user.id)
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        set({ user: null, loading: false });
        return;
      }

      const enrichedUser = {
        ...session.user,
        subscription_type: userData?.subscription_type,
        tokens_remaining: userData?.tokens_remaining
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

      if (data.user) {
        const { user: dbUser, error: dbError } = await authService.getUser(data.user.id);
        if (dbError) throw dbError;
        
        set({ 
          user: {
            ...data.user,
            subscription_type: dbUser?.subscription_type,
            tokens_remaining: dbUser?.tokens_remaining
          }
        });
      }
    } catch (error: any) {
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
        const { user: dbUser, error: dbError } = await authService.createUser(
          data.user.id,
          email
        );
        
        if (dbError) throw dbError;

        set({ 
          user: {
            ...data.user,
            subscription_type: dbUser?.subscription_type,
            tokens_remaining: dbUser?.tokens_remaining
          }
        });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Password update error:', error);
      throw error;
    }
  },

  updateUserTokens: async (newTokenCount: number) => {
    set((state) => ({
      user: state.user ? {
        ...state.user,
        tokens_remaining: newTokenCount
      } : null
    }));
  }
}));
