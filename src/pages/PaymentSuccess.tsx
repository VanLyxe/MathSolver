import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { subscriptionService } from '../services/subscriptionService';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      navigate('/profile');
      return;
    }

    const handlePayment = async () => {
      try {
        await subscriptionService.handlePaymentSuccess(sessionId);
        toast.success('Paiement validé avec succès !');
      } catch (error) {
        console.error('Erreur de paiement:', error);
        toast.error('Erreur lors de la validation du paiement');
        navigate('/profile');
      }
    };

    handlePayment();
  }, [sessionId, navigate]);

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
