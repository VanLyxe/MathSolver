import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PAYMENT_PLANS } from '../constants/pricing';
import PlanCard from '../components/pricing/PlanCard';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { stripeService } from '../services/stripeService';
import toast from 'react-hot-toast';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handlePlanSelection = async (planId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const url = await stripeService.createCheckoutSession(planId, user.id);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Erreur lors de la création de la session de paiement');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Retour</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre formule
          </h1>
          <p className="text-xl text-gray-600">
            Des solutions adaptées à tous vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {PAYMENT_PLANS.map((plan) => (
            <PlanCard 
              key={plan.name} 
              {...plan} 
              onSelect={() => handlePlanSelection(plan.name.toLowerCase().replace(/\s+/g, '-'))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;