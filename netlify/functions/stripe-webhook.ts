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
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId) {
          const { data: userData } = await supabase
            .from('users')
            .select('tokens_remaining')
            .eq('id', userId)
            .single();

          const currentTokens = userData?.tokens_remaining || 0;
          
          await supabase
            .from('users')
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_type: 'premium',
              tokens_remaining: currentTokens + 20,
              subscription_end_date: new Date(
                (session.subscription_end || Date.now() + 30 * 24 * 60 * 60 * 1000)
              ).toISOString()
            })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.status);
        
        // Mettre à jour le statut de l'abonnement
        await supabase
          .from('users')
          .update({
            subscription_type: subscription.status === 'active' ? 'premium' : 'free',
            subscription_end_date: subscription.status === 'active' 
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        console.log('Subscription deleted');
        
        // Réinitialiser complètement l'abonnement
        await supabase
          .from('users')
          .update({
            subscription_type: 'free',
            subscription_end_date: null,
            stripe_subscription_id: null
          })
          .eq('stripe_subscription_id', subscription.id);
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
