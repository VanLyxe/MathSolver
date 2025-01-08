import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { subscriptionService } from '../services/subscriptionService';
import toast from 'react-hot-toast';
import DebugInfo from '../components/DebugInfo';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, checkUser } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer le session_id depuis l'URL complète car il est après le auth_token
  const sessionId = new URL(window.location.href).searchParams.get('session_id');

  useEffect(() => {
    const processPayment = async () => {
      if (!sessionId) {
        setError('Session ID manquant');
        setIsProcessing(false);
        return;
      }

      try {
        await subscriptionService.handlePaymentSuccess(sessionId);
        await checkUser();
        toast.success('Paiement traité avec succès');
        setIsProcessing(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [sessionId, checkUser]);

  // Afficher les infos de debug en permanence
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Traitement du paiement</h1>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p>Session ID: {sessionId || 'Aucun'}</p>
          <p>État: {isProcessing ? 'En cours...' : 'Terminé'}</p>
          {error && <p className="text-red-500">Erreur: {error}</p>}
        </div>

        <DebugInfo 
          isProcessing={isProcessing}
          error={error}
          user={user}
        />

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
