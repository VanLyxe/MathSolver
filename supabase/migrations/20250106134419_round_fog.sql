/*
  # Ajout de la gestion Stripe

  1. Nouvelles Tables
    - `stripe_customers` : Lie les utilisateurs aux clients Stripe
    - `stripe_webhooks` : Stocke l'historique des webhooks Stripe

  2. Modifications
    - Ajout de colonnes Stripe à la table users
    
  3. Sécurité
    - Enable RLS sur les nouvelles tables
    - Ajout des politiques appropriées
*/

-- Table pour les clients Stripe
CREATE TABLE IF NOT EXISTS stripe_customers (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    customer_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour les webhooks Stripe
CREATE TABLE IF NOT EXISTS stripe_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_id TEXT UNIQUE NOT NULL,
    customer_id TEXT,
    subscription_id TEXT,
    status TEXT,
    processed_at TIMESTAMPTZ DEFAULT now()
);

-- Ajout des colonnes Stripe à users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE;

-- Enable RLS
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhooks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own stripe customer"
    ON stripe_customers FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage stripe customers"
    ON stripe_customers FOR ALL
    TO service_role
    USING (true);

CREATE POLICY "Service role can manage webhooks"
    ON stripe_webhooks FOR ALL
    TO service_role
    USING (true);