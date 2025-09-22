
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AffiliateApplicationData {
  nome_completo: string;
  email: string;
  whatsapp: string;
  dados_audiencia: string;
}

function sanitizeString(str: string): string {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/[<>]/g, '') // Remove < e >
    .trim()
    .substring(0, 1000); // Limita tamanho
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateApplicationData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.nome_completo || typeof data.nome_completo !== 'string' || data.nome_completo.trim().length === 0) {
    errors.push('Nome completo é obrigatório');
  }
  
  if (!data.email || typeof data.email !== 'string' || !isValidEmail(data.email)) {
    errors.push('Email válido é obrigatório');
  }
  
  if (!data.whatsapp || typeof data.whatsapp !== 'string' || data.whatsapp.trim().length === 0) {
    errors.push('WhatsApp é obrigatório');
  }
  
  if (!data.dados_audiencia || typeof data.dados_audiencia !== 'string' || data.dados_audiencia.trim().length === 0) {
    errors.push('Dados da audiência são obrigatórios');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`🚀 [AFFILIATE] ${req.method} request received at ${new Date().toISOString()}`);

    if (req.method !== 'POST') {
      console.log('❌ [AFFILIATE] Method not allowed:', req.method);
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const body = await req.json();
    console.log('📝 [AFFILIATE] Request body received:', { 
      nome_completo: body.nome_completo, 
      email: body.email,
      whatsapp_length: body.whatsapp?.length,
      dados_audiencia_length: body.dados_audiencia?.length
    });

    // Validar dados
    const validation = validateApplicationData(body);
    if (!validation.isValid) {
      console.log('❌ [AFFILIATE] Validation errors:', validation.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Dados inválidos', 
          details: validation.errors,
          received_fields: Object.keys(body)
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Sanitizar dados
    const sanitizedData: AffiliateApplicationData = {
      nome_completo: sanitizeString(body.nome_completo),
      email: sanitizeString(body.email).toLowerCase(),
      whatsapp: sanitizeString(body.whatsapp),
      dados_audiencia: sanitizeString(body.dados_audiencia)
    };

    console.log('🧹 [AFFILIATE] Sanitized data ready for insertion');

    // Conectar ao Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [AFFILIATE] Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Configuração do servidor indisponível' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('💾 [AFFILIATE] Inserindo na tabela formulario_afiliados...');

    // Inserir na tabela
    const { data, error } = await supabase
      .from('formulario_afiliados')
      .insert([sanitizedData])
      .select('id, email, data_candidatura')
      .single();

    if (error) {
      console.error('❌ [AFFILIATE] Supabase insertion error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Erro interno do servidor', 
          details: error.message,
          hint: error.hint || 'Verifique se todos os campos obrigatórios foram preenchidos corretamente'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ [AFFILIATE] Successfully inserted affiliate application:', { 
      id: data.id, 
      email: data.email, 
      data_candidatura: data.data_candidatura 
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Candidatura enviada com sucesso!',
        data: {
          id: data.id,
          email: data.email,
          data_candidatura: data.data_candidatura
        }
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 [AFFILIATE] Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: 'Por favor, tente novamente ou entre em contato com o suporte',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
