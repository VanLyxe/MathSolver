import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Stripe } from 'https://esm.sh/stripe@11.1.0?target=deno'
import { corsHeaders } from '../_shared/cors.ts'
import { handleCheckoutCompleted } from './handlers/checkout.ts'
import { handleSubscriptionUpdated, handleSubscriptionDeleted } from './handlers/subscription.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2022-11-15',
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Signature manquante', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    let result
    switch (event.type) {
      case 'checkout.session.completed':
        result = await handleCheckoutCompleted(event.data.object)
        break
      case 'customer.subscription.updated':
        result = await handleSubscriptionUpdated(event.data.object)
        break
      case 'customer.subscription.deleted':
        result = await handleSubscriptionDeleted(event.data.object)
        break
      default:
        console.log(`Événement non géré: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(
      JSON.stringify({ error: { message: err.message } }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})