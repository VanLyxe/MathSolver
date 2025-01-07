import { supabase } from '../lib/supabase';
import { SubscriptionInfo } from '../types/subscription';

export const subscriptionService = {
  async getCustomerPortalUrl(userId: string): Promise<string> {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();

      if (error || !userData?.stripe_customer_id) {
        throw new Error('Client Stripe non trouvé');
      }

      // URL de retour obligatoire vers subscription-update
      const returnUrl = `${window.location.origin}/subscription-update`;

      const response = await fetch('/.netlify/functions/create-customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: userData.stripe_customer_id,
          returnUrl
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du portail client');
      }

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Error getting customer portal URL:', error);
      throw error;
    }
  },

  // ... reste du code inchangé ...
};
