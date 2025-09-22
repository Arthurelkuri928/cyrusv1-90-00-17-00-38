// Versão 2 - Forçando re-deploy com novo secret
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    logStep("Webhook received");

    // Get the Stripe webhook secret and API key
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }
    
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration is missing");
    }

    // Initialize Stripe and Supabase admin client
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the raw body and signature
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      logStep("ERROR: Missing Stripe signature");
      return new Response('Missing Stripe signature', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    logStep("Verifying webhook signature");

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      console.log('Secret que a função está a usar:', Deno.env.get('STRIPE_WEBHOOK_SECRET'));
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      logStep("Webhook signature verified successfully", { eventType: event.type });
    } catch (err) {
      logStep("ERROR: Webhook signature verification failed", { error: err.message });
      return new Response('Webhook signature verification failed', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Process the event based on its type
    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          logStep("Processing invoice.payment_succeeded", { 
            customerId: event.data.object.customer,
            invoiceId: event.data.object.id,
            subscriptionId: event.data.object.subscription
          });

          if (event.data.object.subscription) {
            // Get the subscription details from Stripe to get the current period info
            const subscription = await stripe.subscriptions.retrieve(event.data.object.subscription as string);
            
            // Update subscription status to active and update period dates
            const { data: updateData, error: updateError } = await supabaseAdmin
              .from('stripe_subscriptions')
              .update({
                status: 'active',
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('stripe_subscription_id', subscription.id);

            if (updateError) {
              logStep("ERROR: Failed to update subscription after payment success", { error: updateError });
              throw updateError;
            } else {
              logStep("Successfully updated subscription after payment", { subscriptionId: subscription.id });
            }
          }
          break;

        case 'invoice.payment_failed':
          logStep("Processing invoice.payment_failed", { 
            customerId: event.data.object.customer,
            invoiceId: event.data.object.id,
            subscriptionId: event.data.object.subscription
          });

          if (event.data.object.subscription) {
            // Update subscription status to past_due
            const { data: updateData, error: updateError } = await supabaseAdmin
              .from('stripe_subscriptions')
              .update({
                status: 'past_due',
                updated_at: new Date().toISOString()
              })
              .eq('stripe_subscription_id', event.data.object.subscription as string);

            if (updateError) {
              logStep("ERROR: Failed to update subscription after payment failure", { error: updateError });
              throw updateError;
            } else {
              logStep("Successfully updated subscription to past_due", { subscriptionId: event.data.object.subscription });
            }
          }
          break;

        case 'customer.subscription.created':
          logStep("Processing customer.subscription.created", { 
            customerId: event.data.object.customer,
            subscriptionId: event.data.object.id,
            status: event.data.object.status 
          });

          // Get the customer from Stripe to extract user_id from metadata
          const customer = await stripe.customers.retrieve(event.data.object.customer as string);
          console.log('Objeto do cliente recebido da Stripe:', customer);
          
          if (customer.deleted) {
            logStep("ERROR: Customer was deleted", { customerId: event.data.object.customer });
            throw new Error("Customer was deleted");
          }

          const userId = customer.metadata?.user_id;
          console.log('user_id extraído dos metadados:', userId);
          if (!userId) {
            logStep("ERROR: No user_id found in customer metadata", { customerId: customer.id });
            throw new Error("No user_id found in customer metadata");
          }

          // Insert new subscription record
          const subscriptionCreateData = event.data.object as Stripe.Subscription;
          const { data: insertData, error: insertError } = await supabaseAdmin
            .from('stripe_subscriptions')
            .insert({
              user_id: userId,
              stripe_subscription_id: subscriptionCreateData.id,
              stripe_customer_id: subscriptionCreateData.customer as string,
              status: subscriptionCreateData.status,
              current_period_start: subscriptionCreateData.current_period_start ? new Date(subscriptionCreateData.current_period_start * 1000).toISOString() : null,
              current_period_end: subscriptionCreateData.current_period_end ? new Date(subscriptionCreateData.current_period_end * 1000).toISOString() : null,
              cancel_at_period_end: subscriptionCreateData.cancel_at_period_end || false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            logStep("ERROR: Failed to insert new subscription", { error: insertError });
            throw insertError;
          } else {
            logStep("Successfully created new subscription record", { subscriptionId: subscriptionCreateData.id, userId });
          }
          break;

        case 'customer.subscription.updated':
          logStep("Processing customer.subscription.updated", { 
            customerId: event.data.object.customer,
            subscriptionId: event.data.object.id,
            status: event.data.object.status 
          });

          // Update subscription with all relevant data
          const subscriptionData = event.data.object as Stripe.Subscription;
          const { data: updateData, error: updateError } = await supabaseAdmin
            .from('stripe_subscriptions')
            .update({
              status: subscriptionData.status,
              current_period_start: new Date(subscriptionData.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscriptionData.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscriptionData.cancel_at_period_end || false,
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscriptionData.id);

          if (updateError) {
            logStep("ERROR: Failed to update subscription", { error: updateError });
            throw updateError;
          } else {
            logStep("Successfully updated subscription", { subscriptionId: subscriptionData.id, status: subscriptionData.status });
          }
          break;

        case 'customer.subscription.deleted':
          logStep("Processing customer.subscription.deleted", { 
            customerId: event.data.object.customer,
            subscriptionId: event.data.object.id 
          });

          // Update subscription status to canceled
          const { data: cancelData, error: cancelError } = await supabaseAdmin
            .from('stripe_subscriptions')
            .update({
              status: 'canceled',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', event.data.object.id);

          if (cancelError) {
            logStep("ERROR: Failed to update subscription to canceled", { error: cancelError });
            throw cancelError;
          } else {
            logStep("Successfully updated subscription to canceled", { subscriptionId: event.data.object.id });
          }
          break;

        default:
          logStep("Unhandled event type", { eventType: event.type });
          console.log(`Evento não tratado: ${event.type}`);
      }

      logStep("Webhook processed successfully", { eventType: event.type });

      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } catch (processError) {
      console.log('ERRO DETALHADO DO PROCESSAMENTO:', processError);
      logStep("ERROR: Event processing failed", { 
        error: processError.message,
        eventType: event.type 
      });
      
      // Return success to Stripe even if processing fails
      // This prevents Stripe from retrying the webhook
      return new Response(JSON.stringify({ 
        received: true, 
        error: "Processing failed but webhook acknowledged" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    logStep("ERROR: Webhook handler failed", { error: error.message });
    
    return new Response(JSON.stringify({ 
      error: error.message,
      received: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});