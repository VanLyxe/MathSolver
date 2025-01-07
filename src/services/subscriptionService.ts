import { supabase } from '../lib/supabase';
import { SubscriptionInfo } from '../types/subscription';

export const subscriptionService = {
  async getCustomerPortalUrl(userId: string): Promise<string> {
    const { data: customer, error } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', userId)
      .single();

    if (error || !customer) {
      throw new Error('Client Stripe non trouvé');
    }

    // URL de redirection après paiement
    const returnUrl = `${window.location.origin}/profile`;

    // Dans un environnement de production, cette URL devrait être générée via l'API Stripe
    return `https://billing.stripe.com/p/login/${customer.customer_id}?return_url=${encodeURIComponent(returnUrl)}`;
  },

  async getSubscriptionInfo(userId: string): Promise<SubscriptionInfo | null> {
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
  },

  async handlePaymentSuccess(sessionId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('stripe-webhook-handler', {
      body: { sessionId }
    });

    if (error) {
      throw new Error('Erreur lors de la validation du paiement');
    }
  }
};