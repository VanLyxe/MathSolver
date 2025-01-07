import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from './LoadingSpinner';

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

  // Rendre le composant enfant si authentifié
  return <>{children}</>;
};

export default ProtectedRoute;