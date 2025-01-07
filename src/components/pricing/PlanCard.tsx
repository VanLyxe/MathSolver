import React from 'react';
import { ArrowRight, Star, Infinity, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

interface PlanProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlight: boolean;
  onSelect: (planId: string) => void;
}

const PlanCard: React.FC<PlanProps> = ({
  name,
  price,
  period,
  description,
  features,
  highlight,
  onSelect
}) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const PlanIcon = highlight ? Star : period ? Infinity : Zap;
  const iconColor = highlight ? "text-purple-500" : period ? "text-blue-500" : "text-yellow-500";

  const handleClick = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const planId = name.toLowerCase().replace(/\s+/g, '-');
      onSelect(planId);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Une erreur est survenue lors de la redirection vers le paiement');
    }
  };

  return (
    <div className={`relative flex flex-col bg-white rounded-2xl shadow-xl p-8 h-full ${
      highlight ? 'ring-2 ring-purple-500' : ''
    }`}>
      {highlight && (
        <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm font-medium">
          Populaire
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <p className="text-gray-500 text-sm mt-1">{description}</p>
        </div>
        <PlanIcon className={`h-6 w-6 ${iconColor}`} />
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        {period && <span className="text-gray-500 ml-1">{period}</span>}
      </div>

      <div className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <span className="ml-3 text-gray-600">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-center px-4 py-3 rounded-xl text-white font-medium transition-all ${
          highlight
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90'
            : 'bg-gray-900 hover:bg-gray-800'
        }`}
      >
        Choisir cette offre
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </div>
  );
};

export default PlanCard;