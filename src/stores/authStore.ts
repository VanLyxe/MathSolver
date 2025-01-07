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

      // Récupérer les données utilisateur, y compris subscription_type
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

      // Fusionner les données de session avec les données utilisateur
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

  // ... reste du code inchangé ...
}));
