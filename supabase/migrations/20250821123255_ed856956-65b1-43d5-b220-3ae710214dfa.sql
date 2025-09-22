
-- Add subscription management columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_end_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_type TEXT NOT NULL DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
