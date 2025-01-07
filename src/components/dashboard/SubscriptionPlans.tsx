import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const SubscriptionPlans = () => {
  const navigate = useNavigate();

  const features = [
    "20 résolutions par mois",
    "Renouvellement automatique",
    "Support premium 24/7",
    "Accès prioritaire",
    "Historique illimité"
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Star className="h-6 w-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Abonnement Premium
        </h2>
      </div>
      
      <div className="mb-6">
        <div className="text-3xl font-bold text-purple-600">9.99€</div>
        <div className="text-sm text-gray-600">par mois</div>
      </div>
      
      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => navigate('/pricing')}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
      >
        S'abonner maintenant
      </button>
    </div>
  );
};

export default SubscriptionPlans;