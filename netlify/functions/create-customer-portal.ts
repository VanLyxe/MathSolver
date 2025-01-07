import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

export const handler: Handler = async (event) => {
  // Vérifier la méthode HTTP
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Method Not Allowed',
        details: 'Only POST requests are accepted'
      })
    };
  }

  try {
    // Parser et valider le body
    let customerId, returnUrl;
    try {
      const body = JSON.parse(event.body || '');
      customerId = body.customerId;
      returnUrl = body.returnUrl;
    } catch (e) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Invalid request body',
          details: 'Failed to parse JSON body'
        })
      };
    }

    // Valider les paramètres requis
    if (!customerId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Missing required parameter',
          details: 'Customer ID is required'
        })
      };
    }

    // Créer la session du portail
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: session.url })
      };
    } catch (stripeError: any) {
      console.error('Stripe error:', stripeError);
      
      // Gérer les erreurs Stripe spécifiques
      return {
        statusCode: stripeError.statusCode || 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Stripe error',
          details: stripeError.message,
          type: stripeError.type,
          code: stripeError.code
        })
      };
    }
  } catch (error: any) {
    // Gérer les erreurs générales
    console.error('General error:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};
