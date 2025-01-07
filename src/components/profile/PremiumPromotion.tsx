import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Check } from 'lucide-react';

const PremiumPromotion = () => {
  const navigate = useNavigate();

  const benefits = [
    "20 résolutions par mois",
    "Support premium 24/7",
    "Accès prioritaire aux nouvelles fonctionnalités",
    "Historique illimité",
    "Renouvellement automatique"
  ];

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mt-8">
      <div className="flex items-center space-x-3 mb-4">
        <Star className="h-6 w-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">Passez à l'abonnement Premium</h3>
      </div>

      <p className="text-gray-600 mb-6">
        Profitez d'une expérience optimale avec notre formule la plus complète
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-gray-700">{benefit}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/pricing')}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
      >
        <span>Découvrir nos offres</span>
        <Star className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PremiumPromotion;