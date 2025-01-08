import { supabase } from '../lib/supabase';
import { SubscriptionInfo } from '../types/subscription';

export const subscriptionService = {
  async getCustomerPortalUrl(userId: string): Promise<string> {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();

      if (userError || !user?.stripe_customer_id) {
        throw new Error('Client Stripe non trouvé');
      }

      const response = await fetch('/.netlify/functions/create-customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user.stripe_customer_id,
          returnUrl: `${window.location.origin}/subscription-update`
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session du portail');
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
        .select('subscription_type, subscription_end_date, stripe_subscription_id, cancel_at_period_end')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

      return {
        status: data.subscription_type === 'premium' ? 'active' : 'canceled',
        currentPeriodEnd: data.subscription_end_date,
        cancelAtPeriodEnd: data.cancel_at_period_end || false,
        subscriptionId: data.stripe_subscription_id
      };
    } catch (error) {
      console.error('Error getting subscription info:', error);
      return null;
    }
  },

  async handlePaymentSuccess(sessionId: string): Promise<void> {
    try {
      const response = await fetch('/.netlify/functions/stripe-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'checkout.session.completed',
          data: {
            object: {
              id: sessionId
            }
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erreur lors de la validation du paiement');
      }

      const data = await response.json();
      if (!data.received) {
        throw new Error('La validation du paiement a échoué');
      }
    } catch (error) {
      console.error('Payment validation error:', error);
      throw error;
    }
  }
};
