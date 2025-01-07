import { supabase } from '../lib/supabase';

export const stripeService = {
  async createCheckoutSession(planId: string, userId: string) {
    try {
      // Récupérer la session actuelle
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId,
          successUrl: `${window.location.origin}/payment-success?auth_token=${session?.access_token}`,
          cancelUrl: `${window.location.origin}/pricing`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
};
