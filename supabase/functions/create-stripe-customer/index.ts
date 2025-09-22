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
    console.log("🚀 [create-stripe-customer] Function started");

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
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    console.log(`📧 [create-stripe-customer] User authenticated: ${user.email}, ID: ${user.id}`);

    // Passo A: Verificar se já existe um registro na tabela stripe_customers
    console.log("🔍 [create-stripe-customer] Checking existing Stripe customer...");
    
    const { data: existingCustomer, error: fetchError } = await supabaseClient
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) {
      throw new Error(`Database query error: ${fetchError.message}`);
    }

    // Passo B: Se existe, retornar o stripe_customer_id existente
    if (existingCustomer) {
      console.log(`✅ [create-stripe-customer] Existing customer found: ${existingCustomer.stripe_customer_id}`);
      return new Response(
        JSON.stringify({ 
          stripe_customer_id: existingCustomer.stripe_customer_id,
          created_new: false 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Passo C: Criar novo cliente na Stripe
    console.log("🆕 [create-stripe-customer] Creating new Stripe customer...");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const stripeCustomer = await stripe.customers.create({
      email: user.email,
      metadata: {
        user_id: user.id,
      },
    });

    console.log(`💳 [create-stripe-customer] Stripe customer created: ${stripeCustomer.id}`);

    // Passo D: Inserir novo registro na tabela stripe_customers
    console.log("💾 [create-stripe-customer] Saving to database...");
    
    const { error: insertError } = await supabaseClient
      .from("stripe_customers")
      .insert({
        user_id: user.id,
        stripe_customer_id: stripeCustomer.id,
      });

    if (insertError) {
      // Se houve erro ao salvar no DB, tentar excluir o cliente criado na Stripe
      try {
        await stripe.customers.del(stripeCustomer.id);
        console.log("🗑️ [create-stripe-customer] Stripe customer deleted due to DB error");
      } catch (deleteError) {
        console.error("❌ [create-stripe-customer] Failed to cleanup Stripe customer:", deleteError);
      }
      throw new Error(`Database insert error: ${insertError.message}`);
    }

    console.log("✅ [create-stripe-customer] Customer created and saved successfully");

    // Passo E: Retornar o stripe_customer_id do novo cliente
    return new Response(
      JSON.stringify({ 
        stripe_customer_id: stripeCustomer.id,
        created_new: true 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("❌ [create-stripe-customer] Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: "Failed to create or retrieve Stripe customer" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});