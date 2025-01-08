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
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Extraire le session ID et auth token de l'URL
  const url = new URL(window.location.href);
  const sessionId = url.searchParams.get('session_id');
  const authToken = url.searchParams.get('auth_token');

  useEffect(() => {
    const addDebugInfo = (info: string) => {
      setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${info}`]);
    };

    const initAuth = async () => {
      if (authToken) {
        addDebugInfo('Auth token trouvé, initialisation de la session');
        const { error } = await supabase.auth.setSession({
          access_token: authToken,
          refresh_token: authToken
        });

        if (error) {
          addDebugInfo(`Erreur d'authentification: ${error.message}`);
          return;
        }

        await checkUser();
        addDebugInfo('Session initialisée');
      }
    };

    const handlePayment = async () => {
      try {
        if (!sessionId) {
          throw new Error('Session ID manquant');
        }
        addDebugInfo('Début du traitement du paiement');

        await subscriptionService.handlePaymentSuccess(sessionId);
        addDebugInfo('Paiement traité avec succès');
        toast.success('Paiement traité avec succès');
        
        // Recharger les données utilisateur
        await checkUser();
        setIsProcessing(false);
        
        // Redirection après un court délai
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        console.error('Erreur:', err);
        addDebugInfo(`Erreur: ${err.message}`);
        setError(err.message);
        setIsProcessing(false);
      }
    };

    const init = async () => {
      await initAuth();
      addDebugInfo(`User authenticated: ${!!user}`);
      addDebugInfo(`Session ID: ${sessionId}`);

      if (user) {
        addDebugInfo('Utilisateur connecté, lancement du traitement');
        await handlePayment();
      } else {
        addDebugInfo('Utilisateur non connecté');
      }
    };

    init();
  }, [sessionId, authToken, user, checkUser, navigate]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Traitement du paiement</h1>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p>Session ID: {sessionId || 'Non trouvé'}</p>
          <p>État: {isProcessing ? 'En cours...' : 'Terminé'}</p>
          {error && <p className="text-red-500">Erreur: {error}</p>}
        </div>

        <div className="bg-gray-800 text-white p-4 rounded-lg mb-4 font-mono text-sm">
          <h2 className="text-lg font-bold mb-2">Debug Info:</h2>
          <div className="space-y-1 text-xs">
            {debugInfo.map((info, index) => (
              <p key={index}>{info}</p>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
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
