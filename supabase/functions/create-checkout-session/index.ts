import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Stripe } from 'https://esm.sh/stripe@11.1.0?target=deno'
import { corsHeaders } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2022-11-15',
})

const PLAN_PRICES = {
  discovery: 'price_1QeBv0GKrVOWzXyunyprcNJp', // Remplacer par votre price_id Stripe
  popular: 'price_1QeBwjGKrVOWzXyur8Zg068m',     // Remplacer par votre price_id Stripe
  premium: 'price_1QeByYGKrVOWzXyuWKQIV4gf'      // Remplacer par votre price_id Stripe
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { planId, userId, successUrl, cancelUrl } = await req.json()
    
    if (!planId || !userId || !successUrl || !cancelUrl) {
      throw new Error('Missing required parameters')
    }

    const priceId = PLAN_PRICES[planId]
    if (!priceId) {
      throw new Error('Invalid plan')
    }

    const session = await stripe.checkout.sessions.create({
      mode: planId === 'premium' ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`, // Ajout du session_id
      cancel_url: cancelUrl,
      client_reference_id: userId
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})