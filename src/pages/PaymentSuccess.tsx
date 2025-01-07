import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const { user, checkUser } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      // Afficher un message visible dans l'UI
      setError('Initialisation...');
      
      try {
        const authToken = searchParams.get('auth_token');
        setError(`Auth token: ${authToken ? 'présent' : 'manquant'}`);

        if (!authToken) {
          throw new Error('Token d\'authentification manquant');
        }

        // Restaurer la session avec le token
        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
          access_token: authToken,
          refresh_token: authToken
        });

        if (sessionError) {
          setError(`Erreur session: ${sessionError.message}`);
          throw sessionError;
        }

        if (!session) {
          setError('Session invalide après restauration');
          throw new Error('Session invalide');
        }

        setError('Session restaurée, chargement utilisateur...');
        await checkUser();

        if (!sessionId) {
          setError('ID de session Stripe manquant');
          throw new Error('ID de session Stripe manquant');
        }

        setError('Validation du paiement...');
        await handlePaymentValidation(sessionId);
        
        setError(null);
        setIsProcessing(false);

      } catch (error: any) {
        setError(`Erreur finale: ${error.message}`);
        console.error('Payment success error:', error);
        toast.error('Erreur lors de la validation du paiement');
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    init();
  }, [sessionId, checkUser, navigate, searchParams]);

  const handlePaymentValidation = async (sid: string) => {
    const response = await fetch('/.netlify/functions/stripe-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sid })
    });

    if (!response.ok) {
      throw new Error('Erreur validation paiement');
    }

    toast.success('Paiement validé avec succès !');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner />
        {error && (
          <div className="mt-4 text-red-600 text-center">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">Session expirée, redirection...</p>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Paiement réussi !
        </h1>
        <p className="text-gray-600 mb-8">
          Votre paiement a été traité avec succès. Vos tokens ont été crédités sur votre compte.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Aller au dashboard
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Voir mon profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
