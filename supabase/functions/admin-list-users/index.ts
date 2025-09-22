
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

    // Check if user has permission to view users
    const { data: viewUsersCheck, error: viewUsersError } = await supabaseAdmin.rpc('has_permission_for_user', { 
      p_user_id: user.id, 
      p_action: 'view_users' 
    })
    
    const { data: editSubCheck, error: editSubError } = await supabaseAdmin.rpc('has_permission_for_user', { 
      p_user_id: user.id, 
      p_action: 'edit_user_subscription' 
    })
    
    const { data: manageUsersCheck, error: manageUsersError } = await supabaseAdmin.rpc('has_permission_for_user', { 
      p_user_id: user.id, 
      p_action: 'manage_users' 
    })
    
    if ((viewUsersError && editSubError && manageUsersError) || 
        (!viewUsersCheck && !editSubCheck && !manageUsersCheck)) {
      return new Response(JSON.stringify({ error: 'Access denied. Permission to view users, edit subscriptions, or manage users required.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { search_term = '', page_limit = 50, page_offset = 0 } = await req.json()

    // Get users with profiles using admin client
    const { data: authUsers, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers({
      page: Math.floor(page_offset / page_limit) + 1,
      perPage: page_limit
    })

    if (authUsersError) {
      console.error('Error fetching auth users:', authUsersError)
      return new Response(JSON.stringify({ error: authUsersError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get profiles for these users
    const userIds = authUsers.users.map(u => u.id)
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .in('id', userIds)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return new Response(JSON.stringify({ error: profilesError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Combine auth users with profiles
    const usersWithProfiles = authUsers.users.map(authUser => {
      const profile = profiles?.find(p => p.id === authUser.id)
      return {
        id: authUser.id,
        email: authUser.email || 'email@exemplo.com',
        role: profile?.role || 'user',
        subscription_status: profile?.subscription_status || 'active',
        subscription_type: profile?.subscription_type || 'basic',
        subscription_end_at: profile?.subscription_end_at || null,
        created_at: profile?.created_at || authUser.created_at,
        updated_at: profile?.updated_at || null,
      }
    })

    // Apply search filter if provided
    let filteredUsers = usersWithProfiles
    if (search_term) {
      filteredUsers = usersWithProfiles.filter(user => 
        user.email.toLowerCase().includes(search_term.toLowerCase()) ||
        user.role.toLowerCase().includes(search_term.toLowerCase())
      )
    }

    return new Response(JSON.stringify({
      users: filteredUsers,
      total: authUsers.total || filteredUsers.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Admin list users error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
