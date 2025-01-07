import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const { user, loading, checkUser } = useAuthStore();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const setupAuth = async () => {
      try {
        await checkUser();
      } finally {
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };

    setupAuth();

    return () => {
      mounted = false;
    };
  }, [checkUser]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        await checkUser();
      } else if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkUser, navigate]);

  return {
    user,
    loading: loading && !isInitialized,
    isInitialized,
    requireAuth: () => {
      if (isInitialized && !user) {
        navigate('/auth');
      }
    },
    redirectIfAuthenticated: () => {
      if (isInitialized && user) {
        navigate('/dashboard');
      }
    },
  };
};