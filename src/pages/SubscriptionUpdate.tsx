import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const SubscriptionUpdate = () => {
  const navigate = useNavigate();
  const { checkUser } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState({
    authToken: '',
    error: null as any,
    sessionStatus: 'checking',
    authStatus: 'pending'
  });

  useEffect(() => {
    const handleUpdate = async () => {
      try {
        // Récupérer et parser le token
        const urlParams = new URLSearchParams(window.location.search);
        const authTokenWithParams = urlParams.get('auth_token');
        const authToken = authTokenWithParams?.split('?')[0];
        
        setDebugInfo(prev => ({ ...prev, authToken: authToken || 'Non trouvé' }));

        if (authToken) {
          setDebugInfo(prev => ({ ...prev, authStatus: 'setting_session' }));
          
          const { data, error } = await supabase.auth.setSession({
            access_token: authToken,
            refresh_token: ''
          });

          if (error) {
            throw error;
          }

          if (data.session) {
            setDebugInfo(prev => ({ ...prev, sessionStatus: 'active' }));
            await checkUser();
            toast.success('Abonnement mis à jour avec succès');
            setTimeout(() => navigate('/profile'), 2000);
          }
        } else {
          throw new Error('Token d\'authentification manquant');
        }
      } catch (error: any) {
        setDebugInfo(prev => ({ 
          ...prev, 
          error: error.message,
          sessionStatus: 'error',
          authStatus: 'failed'
        }));
        toast.error('Erreur lors de la mise à jour');
      }
    };

    handleUpdate();
  }, [checkUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Mise à jour de l'abonnement</h1>
        
        {/* État actuel */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">État actuel</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">Session :</span>
              <span className={`${
                debugInfo.sessionStatus === 'active' ? 'text-green-600' : 
                debugInfo.sessionStatus === 'error' ? 'text-red-600' : 
                'text-yellow-600'
              }`}>
                {debugInfo.sessionStatus}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">Auth Status :</span>
              <span className={`${
                debugInfo.authStatus === 'success' ? 'text-green-600' : 
                debugInfo.authStatus === 'failed' ? 'text-red-600' : 
                'text-yellow-600'
              }`}>
                {debugInfo.authStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Token Info */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Token d'authentification</h2>
          <div className="bg-gray-50 p-3 rounded-lg break-all">
            <code className="text-sm">{debugInfo.authToken}</code>
          </div>
        </div>

        {/* Erreur */}
        {debugInfo.error && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Erreur</h2>
            <div className="bg-red-50 p-3 rounded-lg">
              <pre className="text-sm text-red-600 whitespace-pre-wrap">
                {JSON.stringify(debugInfo.error, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retour au profil
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpdate;
