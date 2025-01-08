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

  async handlePaymentSuccess(userId: string): Promise<void> {
    try {
      // Mettre à jour directement via Supabase
      const { error: updateError } = await supabase
        .from('users')
        .update({
          subscription_type: 'premium',
          subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 jours
          tokens_remaining: 20 // Créditer les tokens pour l'abonnement premium
        })
        .eq('id', userId);

      if (updateError) {
        throw new Error('Erreur lors de la mise à jour de l\'abonnement');
      }
    } catch (error) {
      console.error('Payment validation error:', error);
      throw error;
    }
  }
};
