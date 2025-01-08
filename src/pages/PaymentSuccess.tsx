import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { subscriptionService } from '../services/subscriptionService';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { user, requireAuth } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Extraire le session ID de l'URL en prenant en compte le auth_token
  const url = window.location.href;
  const sessionId = url.split('session_id=')[1]?.split('&')[0];

  useEffect(() => {
    const addDebugInfo = (info: string) => {
      setDebugInfo(prev => [...prev, info]);
    };

    // S'assurer que l'utilisateur est authentifié
    requireAuth();
    addDebugInfo(`User authenticated: ${!!user}`);
    addDebugInfo(`Session ID: ${sessionId}`);

    const handlePayment = async () => {
      try {
        if (!sessionId) {
          throw new Error('Session ID manquant');
        }
        addDebugInfo('Début du traitement du paiement');

        await subscriptionService.handlePaymentSuccess(sessionId);
        addDebugInfo('Paiement traité avec succès');
        toast.success('Paiement traité avec succès');
        setIsProcessing(false);
      } catch (err) {
        console.error('Erreur:', err);
        addDebugInfo(`Erreur: ${err.message}`);
        setError(err.message);
        setIsProcessing(false);
      }
    };

    if (user) {
      addDebugInfo('Utilisateur connecté, lancement du traitement');
      handlePayment();
    } else {
      addDebugInfo('Utilisateur non connecté');
    }
  }, [sessionId, user, requireAuth]);

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
          {debugInfo.map((info, index) => (
            <p key={index}>{info}</p>
          ))}
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
