
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

    // Check if user has permission to change user roles
    const { data: permissionCheck, error: permissionError } = await supabaseAdmin.rpc('has_permission_for_user', { 
      p_user_id: user.id, 
      p_action: 'change_user_role' 
    })
    
    if (permissionError || !permissionCheck) {
      return new Response(JSON.stringify({ error: 'Access denied. Only Master Admin can change user roles.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { user_id, new_role } = await req.json()

    if (!user_id || !new_role) {
      return new Response(JSON.stringify({ error: 'User ID and new role are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Validate the new role
    const validRoles = ['admin_master', 'gestor_operacoes', 'editor_conteudo', 'suporte', 'user']
    if (!validRoles.includes(new_role)) {
      return new Response(JSON.stringify({ error: 'Invalid role specified' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update the user's role
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        role: new_role,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id)

    if (updateError) {
      console.error('Error updating user role:', updateError)
      return new Response(JSON.stringify({ error: `Failed to update user role: ${updateError.message}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get updated user info for response
    const { data: updatedProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('id', user_id)
      .single()

    return new Response(JSON.stringify({
      success: true,
      message: `Cargo do usuário atualizado para ${new_role} com sucesso`,
      user: updatedProfile
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
