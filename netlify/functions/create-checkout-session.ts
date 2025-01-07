import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

const PLAN_PRICES = {
  'pack-decouverte': 'price_1QeBv0GKrVOWzXyunyprcNJp',
  'pack-populaire': 'price_1QeBwjGKrVOWzXyur8Zg068m',
  'abonnement-premium': 'price_1QeByYGKrVOWzXyuWKQIV4gf'
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
    
    if (!planId || !userId || !successUrl || !cancelUrl) {
      throw new Error('Missing required parameters');
    }

    const priceId = PLAN_PRICES[planId];
    if (!priceId) {
      throw new Error('Invalid plan');
    }

    const session = await stripe.checkout.sessions.create({
      mode: planId === 'abonnement-premium' ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
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
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};