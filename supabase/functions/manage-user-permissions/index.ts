import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  action: 'update' | 'copy';
  userId: string;
  permissionIds?: string[];
  sourceUserId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Cabeçalho de autorização não encontrado');
    }

    // Verify the user's JWT and get user info
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Token de autorização inválido');
    }

    console.log('🔐 [manage-user-permissions] Chamada por:', user.email);

    // Check if user has admin_master role
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('❌ Erro ao verificar perfil:', profileError);
      throw new Error('Erro ao verificar permissões do usuário');
    }

    if (profile?.role?.trim() !== 'admin_master') {
      console.log('🚫 Acesso negado para role:', profile?.role);
      throw new Error('Acesso negado. Apenas administradores master podem gerenciar permissões.');
    }

    const body: RequestBody = await req.json();
    console.log('📝 Body da requisição:', body);

    const { action, userId, permissionIds } = body;

    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    // Verify target user exists and is administrative
    const { data: targetProfile, error: targetError } = await supabaseClient
      .from('profiles')
      .select('id, role')
      .eq('id', userId)
      .single();

    if (targetError || !targetProfile) {
      throw new Error('Usuário alvo não encontrado');
    }

    if (targetProfile.role?.trim() === 'user') {
      throw new Error('Não é possível gerenciar permissões de usuários não-administrativos');
    }

    console.log('👤 Gerenciando permissões para usuário:', targetProfile.role);

    if (action === 'update') {
      if (!permissionIds || !Array.isArray(permissionIds)) {
        throw new Error('Lista de permissões é obrigatória para atualização');
      }

      // Log the current operation
      await supabaseClient
        .from('admin_audit_logs')
        .insert({
          user_id: user.id,
          action: 'update_user_permissions',
          resource_type: 'user',
          resource_id: userId,
          old_values: null, // Could fetch current permissions for better logging
          new_values: { permission_ids: permissionIds }
        });

      // Remove all current permissions for the user
      const { error: deleteError } = await supabaseClient
        .from('admin_permissions')
        .delete()
        .eq('admin_id', userId);

      if (deleteError) {
        console.error('❌ Erro ao remover permissões existentes:', deleteError);
        throw new Error('Erro ao remover permissões existentes');
      }

      // Add new permissions if any provided
      if (permissionIds.length > 0) {
        const permissionsToInsert = permissionIds.map(permissionId => ({
          admin_id: userId,
          permission_id: permissionId,
          granted_by: user.id,
          granted_at: new Date().toISOString()
        }));

        const { error: insertError } = await supabaseClient
          .from('admin_permissions')
          .insert(permissionsToInsert);

        if (insertError) {
          console.error('❌ Erro ao inserir novas permissões:', insertError);
          throw new Error('Erro ao aplicar novas permissões');
        }
      }

      console.log('✅ Permissões atualizadas com sucesso para usuário:', userId);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Permissões atualizadas com sucesso',
          data: {
            userId,
            permissionsCount: permissionIds.length
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    throw new Error('Ação não suportada');

  } catch (error) {
    console.error('❌ [manage-user-permissions] Erro:', error);

    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
})