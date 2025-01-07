import React from 'react';
import { CreditCard } from 'lucide-react';
import { SubscriptionInfo } from '../../types/subscription';
import { formatDate } from '../../utils/date.utils';
import toast from 'react-hot-toast';

interface SubscriptionManagerProps {
  subscriptionInfo: SubscriptionInfo;
  onManageSubscription: () => Promise<void>;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  subscriptionInfo,
  onManageSubscription
}) => {
  const isActive = subscriptionInfo.status === 'active';
  const [isLoading, setIsLoading] = React.useState(false);

  const handleManageClick = async () => {
    setIsLoading(true);
    try {
      await onManageSubscription();
    } catch (error) {
      toast.error("Impossible d'accéder au portail de gestion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-3">
        <CreditCard className="h-5 w-5 text-purple-600" />
        <div>
          <p className="text-sm text-gray-500">Statut de l'abonnement</p>
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              {isActive ? 'Premium' : 'Inactif'}
            </span>
            {subscriptionInfo.currentPeriodEnd && isActive && (
              <span className="text-sm text-gray-500">
                (Prochain renouvellement le {formatDate(subscriptionInfo.currentPeriodEnd)})
              </span>
            )}
          </div>
        </div>
      </div>
      
      <button
        onClick={handleManageClick}
        disabled={isLoading}
        className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Chargement...' : 'Gérer l\'abonnement'}
      </button>
    </div>
  );
};

export default SubscriptionManager;
