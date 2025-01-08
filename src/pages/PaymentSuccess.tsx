import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { subscriptionService } from '../services/subscriptionService';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import DebugInfo from '../components/DebugInfo';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const { user, checkUser } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handlePayment = async () => {
      if (!sessionId) {
        setError('Session ID manquant');
        setIsProcessing(false);
        return;
      }

      try {
        await subscriptionService.handlePaymentSuccess(sessionId);
        await checkUser(); // Recharger les données utilisateur
        toast.success('Paiement validé avec succès !');
      } catch (error: any) {
        console.error('Erreur de paiement:', error);
        setError(error.message || 'Erreur lors de la validation du paiement');
        toast.error('Erreur lors de la validation du paiement');
      } finally {
        setIsProcessing(false);
      }
    };

    handlePayment();
  }, [sessionId, checkUser]);

  // Rediriger si pas de session ID
  useEffect(() => {
    if (!sessionId) {
      const timer = setTimeout(() => navigate('/dashboard'), 3000);
      return () => clearTimeout(timer);
    }
  }, [sessionId, navigate]);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {isProcessing ? (
          <>
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Validation du paiement en cours...</p>
          </>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-red-500 mb-4">
              <svg 
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Une erreur est survenue
            </h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retour au dashboard
            </button>
          </div>
        ) : (
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
        )}
      </div>
      <DebugInfo 
        isProcessing={isProcessing}
        error={error}
        user={user}
      />
    </>
  );
};

export default PaymentSuccess;
