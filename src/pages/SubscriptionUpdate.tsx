import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const SubscriptionUpdate = () => {
  const navigate = useNavigate();
  const { checkUser } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const handleUpdate = async () => {
      try {
        // Vérifier d'abord le token dans l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const authToken = urlParams.get('auth_token');

        if (authToken) {
          // Si on a un token dans l'URL, on l'utilise pour la session
          const { data, error } = await supabase.auth.setSession({
            access_token: authToken,
            refresh_token: ''
          });
          
          if (error) throw error;
          if (data.session) {
            await checkUser();
          }
        } else {
          // Sinon, on vérifie la session existante
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');

            if (accessToken && refreshToken) {
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (error) throw error;
              if (data.session) {
                await checkUser();
              }
            } else {
              await supabase.auth.refreshSession();
              await checkUser();
            }
          }
        }

        const currentUser = await supabase.auth.getUser();
        if (!currentUser.data.user) {
          throw new Error('Utilisateur non connecté');
        }

        await checkUser();
        toast.success('Votre abonnement a été mis à jour');
        
        if (mounted) {
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        }
      } catch (error) {
        console.error('Error updating subscription:', error);
        toast.error('Une erreur est survenue lors de la mise à jour');
        if (mounted) {
          navigate('/profile');
        }
      }
    };

    handleUpdate();

    return () => {
      mounted = false;
    };
  }, [checkUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <Loader className="h-12 w-12 mx-auto text-purple-600 animate-spin" />
        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          Mise à jour de votre abonnement...
        </h2>
        <p className="text-gray-600">
          Veuillez patienter pendant que nous mettons à jour votre compte
        </p>
      </div>
    </div>
  );
};

export default SubscriptionUpdate;
