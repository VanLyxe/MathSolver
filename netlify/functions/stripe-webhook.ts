import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const signature = event.headers['stripe-signature'];
  if (!signature) {
    return { statusCode: 400, body: 'No signature found' };
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body || '',
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    console.log('Webhook event received:', stripeEvent.type);

    switch (stripeEvent.type) {
      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.status);
        
        // Mettre à jour immédiatement le statut de l'abonnement
        const { error } = await supabase
          .from('users')
          .update({
            subscription_type: subscription.status === 'active' ? 'premium' : 'free',
            subscription_end_date: subscription.status === 'active' 
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Error updating subscription:', error);
          throw error;
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        console.log('Subscription deleted');
        
        // Réinitialiser immédiatement l'abonnement
        const { error } = await supabase
          .from('users')
          .update({
            subscription_type: 'free',
            subscription_end_date: null,
            stripe_subscription_id: null
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Error deleting subscription:', error);
          throw error;
        }
        break;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        received: true,
        type: stripeEvent.type
      })
    };
  } catch (err) {
    console.error('Webhook Error:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `Webhook Error: ${err.message}`
      })
    };
  }
};
