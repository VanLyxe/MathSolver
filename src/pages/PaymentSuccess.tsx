import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { subscriptionService } from '../services/subscriptionService';
import toast from 'react-hot-toast';
import DebugInfo from '../components/DebugInfo';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { user, checkUser } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extraire le session_id de l'URL complète
  const rawUrl = window.location.href;
  const sessionId = rawUrl.split('session_id=').pop();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Traitement du paiement</h1>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4 space-y-2">
          <div className="border-b pb-2">
            <p className="font-semibold">Informations de débogage:</p>
            <p className="break-all text-sm">URL complète: {rawUrl}</p>
            <p className="break-all text-sm">Session ID extrait: {sessionId}</p>
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
