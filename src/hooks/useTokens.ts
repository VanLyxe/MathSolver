import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { tokenService } from '../services/tokenService';

export const useTokens = () => {
  const [tokens, setTokens] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchTokens = async () => {
      if (user) {
        try {
          const count = await tokenService.getUserTokens(user.id);
          setTokens(count);
        } catch (error) {
          console.error('Erreur lors de la récupération des tokens:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTokens();
  }, [user]);

  return {
    tokens,
    loading
  };
};