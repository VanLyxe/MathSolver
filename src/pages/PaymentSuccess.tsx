import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { subscriptionService } from '../services/subscriptionService';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { user, checkUser } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extraire les tokens de l'URL
  const rawUrl = window.location.href;
  const sessionId = rawUrl.split('session_id=').pop();
  const authToken = rawUrl.split('auth_token=')[1]?.split('?')[0];

  useEffect(() => {
    const handlePayment = async () => {
      try {
        // 1. Authentifier l'utilisateur avec le token
        if (authToken) {
          const { error: authError } = await supabase.auth.setSession({
            access_token: authToken,
            refresh_token: ''
          });

          if (authError) {
            throw new Error('Erreur d\'authentification');
          }

          // Recharger les données utilisateur
          await checkUser();
        }

        // 2. Traiter le paiement avec Stripe
        if (sessionId) {
          await subscriptionService.handlePaymentSuccess(sessionId);
          toast.success('Paiement traité avec succès');
          setIsProcessing(false);
        } else {
          throw new Error('Session ID manquant');
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
        setIsProcessing(false);
      }
    };

    handlePayment();
  }, [authToken, sessionId, checkUser]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Traitement du paiement</h1>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4 space-y-2">
          <div className="border-b pb-2">
            <p className="font-semibold">Informations de débogage:</p>
            <p className="break-all text-sm">URL complète: {rawUrl}</p>
            <p className="break-all text-sm">Session ID extrait: {sessionId}</p>
            <p className="break-all text-sm">Auth Token extrait: {authToken}</p>
          </div>
          
          <div>
            <p className="font-semibold">État du traitement:</p>
            <p>Statut: {isProcessing ? 'En cours...' : 'Terminé'}</p>
            {error && <p className="text-red-500">Erreur: {error}</p>}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
