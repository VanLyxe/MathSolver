import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl, supabaseKey)

export async function handleCheckoutCompleted(session) {
  const customerId = session.customer
  const subscriptionId = session.subscription
  const userId = session.client_reference_id

  if (!customerId || !userId) {
    throw new Error('Missing customer or user ID')
  }

  // Mettre à jour l'utilisateur avec les informations Stripe et les tokens
  const { error } = await supabase
    .from('users')
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_type: 'premium',
      tokens_remaining: 20, // Créditer les 20 tokens pour l'abonnement premium
      subscription_end_date: new Date(session.subscription.current_period_end * 1000).toISOString()
    })
    .eq('id', userId)

  if (error) throw error
}