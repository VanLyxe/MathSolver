import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { History } from 'lucide-react';
import ProblemInput from '../components/dashboard/ProblemInput';
import TokenInfo from '../components/dashboard/TokenInfo';
import SubscriptionPlans from '../components/dashboard/SubscriptionPlans';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isPremium = user?.subscription_type === 'premium';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Résolution de problèmes
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProblemInput />
          
          {/* Message et bouton pour accéder à l'historique */}
          <div className="mt-8 bg-purple-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <History className="h-5 w-5 text-purple-600" />
              <p className="text-gray-700">
                Retrouvez l'historique de toutes vos solutions dans votre profil
              </p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-2"
            >
              <span>Voir mon historique</span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          <TokenInfo />
          {!isPremium && <SubscriptionPlans />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
