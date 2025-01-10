import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuthStore();

  // Afficher le spinner uniquement pendant la vérification initiale
  if (loading) {
    return <LoadingSpinner />;
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Vérifier si l'email est confirmé
  if (!user.email_confirmed_at) {
    toast.error('Veuillez confirmer votre email avant d\'accéder à cette page');
    return <Navigate to="/auth" replace />;
  }

  // Rendre le composant enfant si authentifié et email confirmé
  return <>{children}</>;
};

export default ProtectedRoute;
