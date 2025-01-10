import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl, supabaseKey)

export async function handleSubscriptionUpdated(subscription) {
  // Vérifier si c'est un renouvellement d'abonnement actif
  const isRenewal = subscription.status === 'active' && 
                    subscription.current_period_start < subscription.current_period_end;

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (userError) throw userError;

  // Si c'est un renouvellement, appeler la fonction de renouvellement des tokens
  if (isRenewal) {
    const { data: renewalData, error: renewalError } = await supabase
      .rpc('renew_premium_tokens', { user_id: userData.id });

    if (renewalError) throw renewalError;
  }

  const { error } = await supabase
    .from('users')
    .update({
      subscription_type: subscription.status === 'active' ? 'premium' : 'free',
      subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) throw error;
}

export async function handleSubscriptionDeleted(subscription) {
  const { error } = await supabase
    .from('users')
    .update({
      subscription_type: 'free',
      subscription_end_date: null
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) throw error;
}
