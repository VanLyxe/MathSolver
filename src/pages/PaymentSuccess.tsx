import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { subscriptionService } from '../services/subscriptionService';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { user, checkUser } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isPaymentProcessed, setIsPaymentProcessed] = useState(false);

  // Utiliser URLSearchParams pour parser l'URL correctement
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id')?.split('?')[0];
  const planId = urlParams.get('plan_id')?.split('?')[0];

  useEffect(() => {
    const addDebugInfo = (info: string) => {
      setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${info}`]);
    };

    const handlePayment = async () => {
      if (isPaymentProcessed) return; // Éviter le traitement multiple
      
      try {
        if (!sessionId) {
          throw new Error('Session ID non trouvé');
        }

        if (!user?.id) {
          addDebugInfo('Utilisateur non connecté');
          return; // Attendre que l'utilisateur soit chargé
        }

        addDebugInfo('Début du traitement du paiement');
        await subscriptionService.handlePaymentSuccess(user.id, planId);
        addDebugInfo('Paiement traité avec succès');
        
        setIsPaymentProcessed(true);
        setIsProcessing(false);
        
        toast.success(planId?.includes('premium') ? 
          'Abonnement premium activé avec succès !' : 
          'Tokens ajoutés avec succès !');
        
        await checkUser(); // Recharger les données utilisateur une seule fois
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        console.error('Erreur:', err);
        addDebugInfo(`Erreur: ${err.message}`);
        setError(err.message);
        setIsProcessing(false);
        setIsPaymentProcessed(true);
      }
    };

    handlePayment();
  }, [sessionId, planId, user?.id]); // Dépendre uniquement de user.id au lieu de user entier

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Traitement du paiement</h1>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p>Session ID: {sessionId || 'Non trouvé'}</p>
          <p>Plan: {planId || 'Non spécifié'}</p>
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
