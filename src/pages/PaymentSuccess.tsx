import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { subscriptionService } from '../services/subscriptionService';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { user, checkUser } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id')?.split('?')[0];
  const planId = urlParams.get('plan_id')?.split('?')[0];

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    let mounted = true;

    const initializePayment = async () => {
      if (!mounted) return;
      
      try {
        addLog('Initialisation du processus de paiement');
        
        // Récupérer la session
        const { data: { session } } = await supabase.auth.getSession();
        
        // Si pas de session, tenter de restaurer avec le hash de l'URL
        if (!session) {
          addLog('Tentative de restauration de la session...');
          
          // Récupérer le hash de l'URL s'il existe
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            addLog('Tokens trouvés, restauration de la session...');
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) throw error;
            if (data.session) {
              addLog('Session restaurée avec succès');
              await checkUser();
            }
          } else {
            addLog('Tentative de rafraîchissement de la session...');
            await supabase.auth.refreshSession();
            await checkUser();
          }
        }

        // Vérifier les paramètres
        if (!sessionId || !planId) {
          throw new Error('Paramètres manquants');
        }
        addLog(`Session ID: ${sessionId}`);
        addLog(`Plan: ${planId}`);

        // Vérifier l'utilisateur
        const currentUser = await supabase.auth.getUser();
        if (!currentUser.data.user) {
          throw new Error('Utilisateur non connecté');
        }
        addLog('Utilisateur connecté');

        // Traiter le paiement
        addLog('Traitement du paiement...');
        await subscriptionService.handlePaymentSuccess(currentUser.data.user.id, planId);
        
        // Mettre à jour l'utilisateur
        addLog('Mise à jour des informations utilisateur');
        await checkUser();

        // Succès
        addLog('Paiement traité avec succès');
        setIsProcessing(false);
        toast.success('Paiement effectué avec succès !');
        
        // Redirection
        setTimeout(() => {
          if (mounted) {
            navigate('/dashboard');
          }
        }, 2000);

      } catch (err: any) {
        if (!mounted) return;
        
        const errorMessage = err.message || 'Une erreur est survenue';
        addLog(`Erreur: ${errorMessage}`);
        setError(errorMessage);
        setIsProcessing(false);
      }
    };

    initializePayment();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">
              Traitement du paiement
            </h1>
          </div>

          <div className="px-6 py-4">
            <div className="space-y-4">
              {/* Informations de base */}
              <div className="bg-gray-50 rounded p-4">
                <p><strong>Session ID:</strong> {sessionId || 'Non trouvé'}</p>
                <p><strong>Plan:</strong> {planId || 'Non spécifié'}</p>
                <p><strong>État:</strong> {isProcessing ? 'En cours...' : 'Terminé'}</p>
                {error && (
                  <p className="text-red-600 mt-2">
                    <strong>Erreur:</strong> {error}
                  </p>
                )}
              </div>

              {/* Logs */}
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                <h2 className="text-white text-sm font-semibold mb-2">Logs:</h2>
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <p key={index} className="text-gray-300 text-xs">
                      {log}
                    </p>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
