import React from 'react';
import { useAuthStore } from '../stores/authStore';
import ProblemInput from '../components/dashboard/ProblemInput';
import TokenInfo from '../components/dashboard/TokenInfo';
import SubscriptionPlans from '../components/dashboard/SubscriptionPlans';

const Dashboard: React.FC = () => {
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
