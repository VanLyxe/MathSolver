import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

const PLAN_PRICES = {
  'pack-decouverte': {
    priceId: 'price_1QeBv0GKrVOWzXyunyprcNJp',
    mode: 'payment'
  },
  'pack-populaire': {
    priceId: 'price_1QeBwjGKrVOWzXyur8Zg068m',
    mode: 'payment'
  },
  'abonnement-premium': {
    priceId: 'price_1QeByYGKrVOWzXyuWKQIV4gf',
    mode: 'subscription'
  }
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { planId, userId, successUrl, cancelUrl } = JSON.parse(event.body || '');
    
    // Log pour déboguer
    console.log('Received planId:', planId);
    console.log('Available plans:', Object.keys(PLAN_PRICES));
    
    if (!planId || !userId || !successUrl || !cancelUrl) {
      throw new Error('Missing required parameters');
    }

    const plan = PLAN_PRICES[planId];
    if (!plan) {
      throw new Error(`Invalid plan: ${planId}`);
    }

    // Log pour déboguer
    console.log('Selected plan:', plan);

    const session = await stripe.checkout.sessions.create({
      mode: plan.mode,
      payment_method_types: ['card'],
      line_items: [{
        price: plan.priceId,
        quantity: 1
      }],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      client_reference_id: userId
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Checkout error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: error.message,
        details: error.stack,
        received: event.body // Ajouter le body reçu pour déboguer
      }),
    };
  }
};
