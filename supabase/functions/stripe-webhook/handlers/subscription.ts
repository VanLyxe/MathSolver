import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl, supabaseKey)

export async function handleSubscriptionUpdated(subscription) {
  const { error } = await supabase
    .from('users')
    .update({
      subscription_type: subscription.status === 'active' ? 'premium' : 'free',
      subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) throw error
}

export async function handleSubscriptionDeleted(subscription) {
  const { error } = await supabase
    .from('users')
    .update({
      subscription_type: 'free',
      subscription_end_date: null
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) throw error
}