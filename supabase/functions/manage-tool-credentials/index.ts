import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CredentialData {
  type: string;
  label: string;
  value: string;
}

interface RequestBody {
  toolId: string;
  credentials: CredentialData[];
  action: 'create' | 'update' | 'delete' | 'get';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid authorization token');
    }

    // Check if user has admin permissions
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin_master', 'gestor_operacoes'].includes(profile.role?.trim())) {
      throw new Error('Insufficient permissions');
    }

    const { toolId, credentials, action }: RequestBody = await req.json();

    // Validate required fields
    if (!toolId || !action) {
      throw new Error('Missing required fields: toolId and action');
    }

    console.log(`📝 Processing ${action} action for tool ${toolId}`);

    let result;

    switch (action) {
      case 'get':
        const { data: existingCreds } = await supabaseClient
          .from('tool_credentials')
          .select('credentials')
          .eq('tool_id', toolId)
          .single();
        
        result = existingCreds?.credentials || [];
        break;

      case 'create':
      case 'update':
        if (!credentials || !Array.isArray(credentials)) {
          throw new Error('Invalid credentials data');
        }

        // Validate credentials structure
        for (const cred of credentials) {
          if (!cred.type || !cred.label || cred.value === undefined) {
            throw new Error('Invalid credential structure');
          }
        }

        // Check if record exists
        const { data: existing } = await supabaseClient
          .from('tool_credentials')
          .select('id')
          .eq('tool_id', toolId)
          .single();

        if (existing) {
          // Update existing record
          const { data: updateData, error: updateError } = await supabaseClient
            .from('tool_credentials')
            .update({ 
              credentials: credentials,
              updated_at: new Date().toISOString()
            })
            .eq('tool_id', toolId)
            .select()
            .single();

          if (updateError) throw updateError;
          result = updateData;
        } else {
          // Create new record
          const { data: createData, error: createError } = await supabaseClient
            .from('tool_credentials')
            .insert({
              tool_id: toolId,
              credentials: credentials
            })
            .select()
            .single();

          if (createError) throw createError;
          result = createData;
        }

        // Log admin action
        await supabaseClient
          .from('admin_audit_logs')
          .insert({
            user_id: user.id,
            action: `${action}_tool_credentials`,
            resource_type: 'tool_credentials',
            resource_id: toolId,
            new_values: { credentials },
            timestamp: new Date().toISOString()
          });

        break;

      case 'delete':
        const { error: deleteError } = await supabaseClient
          .from('tool_credentials')
          .delete()
          .eq('tool_id', toolId);

        if (deleteError) throw deleteError;

        // Log admin action
        await supabaseClient
          .from('admin_audit_logs')
          .insert({
            user_id: user.id,
            action: 'delete_tool_credentials',
            resource_type: 'tool_credentials',
            resource_id: toolId,
            timestamp: new Date().toISOString()
          });

        result = { success: true };
        break;

      default:
        throw new Error('Invalid action');
    }

    console.log(`✅ Successfully processed ${action} for tool ${toolId}`);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Error in manage-tool-credentials:', error.message);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});