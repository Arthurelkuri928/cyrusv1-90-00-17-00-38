import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 [create-subscription] Function started");

    // Initialize Supabase client with service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    console.log(`👤 [create-subscription] User authenticated: ${user.id}`);

    // Parse request body to get customerId and priceId
    const { customerId, priceId } = await req.json();

    if (!customerId || !priceId) {
      throw new Error("customerId and priceId are required parameters");
    }

    console.log(`💳 [create-subscription] Creating subscription for customer: ${customerId}, price: ${priceId}`);

    // Initialize Stripe client
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Create subscription with specific configuration
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    console.log(`✅ [create-subscription] Subscription created: ${subscription.id}`);

    // Extract client_secret from the expanded payment_intent
    const clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;

    if (!clientSecret) {
      throw new Error("Failed to retrieve client_secret from subscription");
    }

    console.log(`🔑 [create-subscription] Client secret obtained successfully`);

    // Return subscription details
    return new Response(
      JSON.stringify({ 
        subscriptionId: subscription.id,
        clientSecret: clientSecret
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("❌ [create-subscription] Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: "Failed to create subscription" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});