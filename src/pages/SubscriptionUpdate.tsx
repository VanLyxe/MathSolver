import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const SubscriptionUpdate = () => {
  const navigate = useNavigate();
  const { checkUser } = useAuthStore();

  useEffect(() => {
    const handleUpdate = async () => {
      try {
        // Recharger les données utilisateur pour obtenir le nouveau statut
        await checkUser();
        toast.success('Votre abonnement a été mis à jour');
        navigate('/profile');
      } catch (error) {
        console.error('Error updating subscription:', error);
        toast.error('Une erreur est survenue lors de la mise à jour');
        navigate('/profile');
      }
    };

    handleUpdate();
  }, [checkUser, navigate]);

  return <LoadingSpinner />;
};

export default SubscriptionUpdate;