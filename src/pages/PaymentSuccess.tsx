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

  useEffect(() => {
    const init = async () => {
      console.log('Starting PaymentSuccess initialization...');
      try {
        // Récupérer la session depuis l'URL
        const authToken = searchParams.get('auth_token');
        console.log('Auth token from URL:', authToken ? 'Present' : 'Missing');
        
        if (!authToken) {
          throw new Error('Token d\'authentification manquant');
        }

        // Restaurer la session
        console.log('Attempting to restore session...');
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: authToken,
          refresh_token: authToken
        });

        if (sessionError) {
          console.error('Session restoration error:', sessionError);
          throw sessionError;
        }
        console.log('Session restored successfully:', sessionData.session ? 'Valid' : 'Invalid');

        // Recharger les données utilisateur
        console.log('Reloading user data...');
        await checkUser();
        console.log('User data reloaded:', user ? 'Success' : 'Failed');

        // Valider le paiement une fois authentifié
        if (sessionId) {
          console.log('Processing payment validation...');
          await handlePaymentValidation(sessionId);
          console.log('Payment validation completed');
        }
      } catch (error) {
        console.error('Detailed error in init:', error);
        toast.error('Erreur lors de la validation du paiement');
        navigate('/auth');
      } finally {
        setIsProcessing(false);
      }
    };

    init();
  }, [sessionId, checkUser, navigate, searchParams]);

  const handlePaymentValidation = async (sid: string) => {
    console.log('Starting payment validation for session:', sid);
    try {
      const response = await fetch('/.netlify/functions/stripe-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: sid })
      });

      console.log('Webhook response status:', response.status);
      const responseData = await response.json();
      console.log('Webhook response data:', responseData);

      if (!response.ok) {
        throw new Error('Erreur lors de la validation du paiement');
      }

      toast.success('Paiement validé avec succès !');
    } catch (error) {
      console.error('Detailed payment validation error:', error);
      throw error;
    }
  };

  if (isProcessing) {
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log('No user found after processing, redirecting to auth...');
    navigate('/auth');
    return null;
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
