-- Allow NULL values for current_period_start and current_period_end in stripe_subscriptions
ALTER TABLE public.stripe_subscriptions 
ALTER COLUMN current_period_start DROP NOT NULL,
ALTER COLUMN current_period_end DROP NOT NULL;