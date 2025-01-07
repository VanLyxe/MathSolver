import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTokens } from '../hooks/useTokens';
import { Mail, Key, CreditCard, Crown } from 'lucide-react';
import PremiumPromotion from '../components/profile/PremiumPromotion';
import PasswordChangeModal from '../components/profile/PasswordChangeModal';
import SolutionHistory from '../components/profile/SolutionHistory';
import SubscriptionManager from '../components/profile/SubscriptionManager';
import { subscriptionService } from '../services/subscriptionService';
import { SubscriptionInfo } from '../types/subscription';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuthStore();
  const { tokens } = useTokens();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);

  useEffect(() => {
    const loadSubscriptionInfo = async () => {
      if (user) {
        const info = await subscriptionService.getSubscriptionInfo(user.id);
        setSubscriptionInfo(info);
      }
    };
    loadSubscriptionInfo();
  }, [user]);

  const handleManageSubscription = async () => {
    if (!user) return;
    
    try {
      const portalUrl = await subscriptionService.getCustomerPortalUrl(user.id);
      window.location.href = portalUrl;
    } catch (error) {
      toast.error("Impossible d'accéder au portail de gestion");
    }
  };

  const isPremium = subscriptionInfo?.status === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>
        
        <div className="grid gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            {/* Informations de base */}
            <div className="flex items-center space-x-4 pb-6 border-b">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.email}
                </h2>
                <p className="text-gray-500">
                  Membre depuis le {new Date(user?.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Détails du compte */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Colonne gauche */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Adresse email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Type de compte</p>
                    <p className="font-medium">
                      {isPremium ? 'Premium' : 'Standard'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Tokens restants</p>
                    <p className="font-medium">{tokens}</p>
                  </div>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-6">
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Key className="h-5 w-5 text-gray-600" />
                  <span>Changer le mot de passe</span>
                </button>
              </div>
            </div>

            {/* Section abonnement */}
            {subscriptionInfo && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Abonnement
                </h3>
                <SubscriptionManager
                  subscriptionInfo={subscriptionInfo}
                  onManageSubscription={handleManageSubscription}
                />
              </div>
            )}

            {/* Afficher PremiumPromotion uniquement si pas d'abonnement actif */}
            {!isPremium && <PremiumPromotion />}
          </div>

          {/* Historique des solutions */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Historique des solutions
            </h2>
            <SolutionHistory />
          </div>
        </div>
      </div>

      <PasswordChangeModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;