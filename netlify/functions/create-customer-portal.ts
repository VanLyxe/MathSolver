import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

// Initialiser Stripe avec la clé secrète et la configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
  appInfo: {
    name: 'MathSolver',
    version: '1.0.0'
  },
  typescript: true,
  maxNetworkRetries: 2,
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

    // Créer la configuration du portail client
    const configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'MathSolver - Gestion de votre abonnement',
        privacy_policy_url: 'https://mathsolver.fr/legal/privacy',
        terms_of_service_url: 'https://mathsolver.fr/legal/terms'
      },
      features: {
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: ['too_expensive', 'missing_features', 'unused', 'other']
          }
        },
        subscription_pause: {
          enabled: false
        },
        payment_method_update: {
          enabled: true
        },
        customer_update: {
          enabled: true,
          allowed_updates: ['email']
        }
      }
    });

    // Créer la session du portail avec la configuration
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
      configuration: configuration.id
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url })
    };
  } catch (error: any) {
    console.error('Portal error:', error);
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: error.message,
        type: error.type,
        code: error.code
      })
    };
  }
};
