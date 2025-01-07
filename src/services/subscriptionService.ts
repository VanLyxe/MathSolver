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

      const response = await fetch('/.netlify/functions/create-customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: userData.stripe_customer_id,
          returnUrl: `${window.location.origin}/subscription-update`
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

  async getSubscriptionInfo(userId: string): Promise<SubscriptionInfo | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_type, subscription_end_date, stripe_subscription_id')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

      return {
        status: data.subscription_type === 'premium' ? 'active' : 'canceled',
        currentPeriodEnd: data.subscription_end_date,
        cancelAtPeriodEnd: false,
        subscriptionId: data.stripe_subscription_id
      };
    } catch (error) {
      console.error('Error getting subscription info:', error);
      return null;
    }
  },

  async handlePaymentSuccess(sessionId: string): Promise<void> {
    const response = await fetch('/.netlify/functions/stripe-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la validation du paiement');
    }
  }
};
