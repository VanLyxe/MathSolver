import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { subscriptionService } from '../services/subscriptionService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

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
        navigate('/profile');
      } catch (error) {
        console.error('Erreur de paiement:', error);
        toast.error('Erreur lors de la validation du paiement');
        navigate('/profile');
      }
    };

    handlePayment();
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
};


export default PaymentSuccess;