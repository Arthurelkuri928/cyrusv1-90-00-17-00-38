/*
import { loadStripe } from '@stripe/stripe-js';

// Get the publishable key from environment variables
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Log helpful information for debugging
if (!stripePublishableKey) {
  console.warn('⚠️ VITE_STRIPE_PUBLISHABLE_KEY não foi definida nas variáveis de ambiente.');
  console.log('📝 Para corrigir: vá para Project > Settings > Environment no Lovable e adicione VITE_STRIPE_PUBLISHABLE_KEY como uma variável Client/Public.');
}

// Create and export the Stripe promise only if we have a key
export const stripePromise = stripePublishableKey 
  ? loadStripe(stripePublishableKey)
  : null;

// Export a flag to check if Stripe is configured
export const isStripeConfigured = !!stripePublishableKey;
*/

