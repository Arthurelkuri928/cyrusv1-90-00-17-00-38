
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

    // Check if user has permission to manage users
    const { data: permissionCheck, error: permissionError } = await supabaseAdmin.rpc('has_permission_for_user', { 
      p_user_id: user.id, 
      p_action: 'manage_users' 
    })
    
    if (permissionError || !permissionCheck) {
      return new Response(JSON.stringify({ error: 'Access denied. Permission to manage users required.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Find expired subscriptions
    const now = new Date().toISOString()
    const { data: expiredProfiles, error: findError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .not('subscription_end_at', 'is', null)
      .lt('subscription_end_at', now)
      .neq('subscription_status', 'expired')

    if (findError) {
      return new Response(JSON.stringify({ error: findError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!expiredProfiles || expiredProfiles.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        deactivated_count: 0,
        message: 'No expired subscriptions found'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update expired subscriptions
    const expiredIds = expiredProfiles.map(p => p.id)
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'expired',
        updated_at: new Date().toISOString()
      })
      .in('id', expiredIds)

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      success: true,
      deactivated_count: expiredProfiles.length,
      message: `${expiredProfiles.length} assinaturas foram desativadas`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Admin deactivate expired error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
