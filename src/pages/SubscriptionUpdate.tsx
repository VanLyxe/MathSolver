import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const SubscriptionUpdate = () => {
  const navigate = useNavigate();
  const { checkUser } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const handleUpdate = async () => {
      if (!mounted) return;
      
      try {
        // Vérifier la session existante
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Si pas de session, essayer de récupérer le token dans l'URL
          const urlParams = new URLSearchParams(window.location.search);
          const authToken = urlParams.get('auth_token');

          if (authToken) {
            // Essayer de restaurer la session avec le token
            const { data, error } = await supabase.auth.setSession({
              access_token: authToken,
              refresh_token: ''
            });
            
            if (error) throw error;
            if (!data.session) throw new Error('Impossible de restaurer la session');
          } else {
            // Si pas de token, essayer de rafraîchir la session
            const { error } = await supabase.auth.refreshSession();
            if (error) throw error;
          }
        }

        // Mettre à jour les données utilisateur
        await checkUser();
        
        setIsProcessing(false);
        toast.success('Abonnement mis à jour avec succès');
        
        // Rediriger après un court délai
        setTimeout(() => {
          if (mounted) {
            navigate('/profile');
          }
        }, 3000);

      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || 'Une erreur est survenue');
        setIsProcessing(false);
      }
    };

    handleUpdate();

    return () => {
      mounted = false;
    };
  }, [checkUser, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Une erreur est survenue</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au profil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {isProcessing ? (
          <>
            <Loader className="h-12 w-12 mx-auto text-purple-600 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
              Mise à jour en cours...
            </h2>
            <p className="text-gray-600">
              Veuillez patienter pendant que nous mettons à jour votre abonnement
            </p>
          </>
        ) : (
          <>
            <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
              Mise à jour réussie !
            </h2>
            <p className="text-gray-600 mb-6">
              Votre abonnement a été mis à jour avec succès.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Vous allez être redirigé vers votre profil dans quelques secondes...
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Voir mon profil
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionUpdate;
