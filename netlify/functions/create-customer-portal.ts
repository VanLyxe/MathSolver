import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { customerId, returnUrl } = JSON.parse(event.body || '');

    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    // Créer la session du portail directement
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.URL || ''}/profile`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (error: any) {
    console.error('Portal error:', error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ 
        error: error.message,
        type: error.type,
        code: error.code
      })
    };
  }
};
