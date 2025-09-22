
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')

    // Verify the user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if user has permission to update subscriptions
    const { data: permissionCheck, error: permissionError } = await supabaseAdmin.rpc('has_permission_for_user', { 
      p_user_id: user.id, 
      p_action: 'edit_user_subscription' 
    })
    
    if (permissionError || !permissionCheck) {
      return new Response(JSON.stringify({ error: 'Access denied. Permission to manage subscriptions required.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { 
      target_user_id, 
      new_expiration = null, 
      new_status = null, 
      extend_days = null 
    } = await req.json()

    if (!target_user_id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get current profile
    const { data: currentProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('subscription_end_at, subscription_status')
      .eq('id', target_user_id)
      .single()

    if (profileError) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Calculate new expiration date
    let newExpirationDate = currentProfile.subscription_end_at
    
    if (extend_days !== null) {
      const currentDate = currentProfile.subscription_end_at 
        ? new Date(currentProfile.subscription_end_at) 
        : new Date()
      currentDate.setDate(currentDate.getDate() + extend_days)
      newExpirationDate = currentDate.toISOString()
    } else if (new_expiration !== null) {
      newExpirationDate = new_expiration
    }

    // Update the subscription
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (newExpirationDate !== currentProfile.subscription_end_at) {
      updateData.subscription_end_at = newExpirationDate
    }

    if (new_status !== null) {
      updateData.subscription_status = new_status
    }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', target_user_id)

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Assinatura atualizada com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Admin update subscription error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
