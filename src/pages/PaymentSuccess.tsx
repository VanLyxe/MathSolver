import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { subscriptionService } from '../services/subscriptionService';
import toast from 'react-hot-toast';

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
        await checkUser();
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

  return (
    <div className="min-h-screen p-8">
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-bold mb-2">État de la page</h2>
        <pre className="whitespace-pre-wrap">
          {`
Session ID: ${sessionId || 'aucun'}
Processing: ${isProcessing}
Error: ${error || 'aucune'}
User: ${JSON.stringify(user, null, 2)}
          `}
        </pre>
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
  );
};

export default PaymentSuccess;
