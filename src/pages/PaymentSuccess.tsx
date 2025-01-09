import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { subscriptionService } from '../services/subscriptionService';
import { supabase } from '../lib/supabase';
import { CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { checkUser } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id')?.split('?')[0];
  const planId = urlParams.get('plan_id')?.split('?')[0];

  const getPlanName = (id: string) => {
    switch (id) {
      case 'pack-exercice':
        return '5 résolutions de problèmes';
      case 'pack-populaire':
        return '10 résolutions de problèmes';
      case 'abonnement-premium':
        return 'Abonnement Premium';
      default:
        return 'Plan';
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializePayment = async () => {
      if (!mounted) return;
      
      try {
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

        if (!sessionId || !planId) {
          throw new Error('Paramètres manquants');
        }

        const currentUser = await supabase.auth.getUser();
        if (!currentUser.data.user) {
          throw new Error('Utilisateur non connecté');
        }

        await subscriptionService.handlePaymentSuccess(currentUser.data.user.id, planId);
        await checkUser();

        setIsProcessing(false);
        toast.success('Paiement effectué avec succès !');
        
        setTimeout(() => {
          if (mounted) {
            navigate('/dashboard');
          }
        }, 3000);

      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || 'Une erreur est survenue');
        setIsProcessing(false);
      }
    };

    initializePayment();

    return () => {
      mounted = false;
    };
  }, []);

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
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au dashboard
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
              Traitement en cours...
            </h2>
            <p className="text-gray-600">
              Veuillez patienter pendant que nous finalisons votre commande
            </p>
          </>
        ) : (
          <>
            <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
              Paiement réussi !
            </h2>
            <p className="text-gray-600 mb-6">
              Merci pour votre achat. Votre {getPlanName(planId || '')} a été activé avec succès.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Vous allez être redirigé vers le dashboard dans quelques secondes...
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Accéder au dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
