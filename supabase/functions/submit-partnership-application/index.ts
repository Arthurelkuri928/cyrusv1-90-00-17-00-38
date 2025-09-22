
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuração do cliente Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Função para validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para sanitizar texto (remover caracteres perigosos)
function sanitizeText(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/[<>]/g, '') // Remove < e >
    .trim()
    .substring(0, 1000); // Limita a 1000 caracteres
}

serve(async (req) => {
  console.log('🚀 [PARTNERSHIP] Recebida requisição:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método não permitido' }), 
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const requestData = await req.json();
    console.log('📝 [PARTNERSHIP] Dados recebidos completos:', requestData);

    // Campos obrigatórios conforme o que o frontend envia
    const requiredFields = [
      'nome_completo', 
      'email_profissional', 
      'whatsapp', 
      'plataforma', 
      'numero_seguidores', 
      'area_atuacao_principal', 
      'experiencia_afiliacao', 
      'motivo_parceria'
    ];
    
    const missingFields = requiredFields.filter(field => !requestData[field] || requestData[field].trim() === '');
    
    if (missingFields.length > 0) {
      console.error('❌ [PARTNERSHIP] Campos obrigatórios faltando:', missingFields);
      return new Response(
        JSON.stringify({ 
          error: 'Campos obrigatórios faltando',
          missing_fields: missingFields,
          received_fields: Object.keys(requestData)
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validar formato de email
    if (!isValidEmail(requestData.email_profissional)) {
      console.error('❌ [PARTNERSHIP] Email inválido:', requestData.email_profissional);
      return new Response(
        JSON.stringify({ error: 'Email inválido' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Sanitizar todos os campos de texto - mapeando corretamente
    const sanitizedData = {
      nome_completo: sanitizeText(requestData.nome_completo),
      email_profissional: sanitizeText(requestData.email_profissional),
      whatsapp: sanitizeText(requestData.whatsapp),
      plataforma: sanitizeText(requestData.plataforma),
      numero_seguidores: sanitizeText(requestData.numero_seguidores),
      area_atuacao_principal: sanitizeText(requestData.area_atuacao_principal),
      experiencia_afiliacao: sanitizeText(requestData.experiencia_afiliacao),
      motivo_parceria: sanitizeText(requestData.motivo_parceria),
      link_perfil_principal: requestData.link_perfil_principal ? sanitizeText(requestData.link_perfil_principal) : ''
    };

    console.log('🧹 [PARTNERSHIP] Dados sanitizados:', Object.keys(sanitizedData));
    console.log('💾 [PARTNERSHIP] Inserindo na tabela partnership_applications...');

    // Inserir dados na tabela
    const { data, error } = await supabase
      .from('partnership_applications')
      .insert([sanitizedData])
      .select('id, email_profissional, data_candidatura')
      .single();

    if (error) {
      console.error('❌ [PARTNERSHIP] Erro ao inserir dados:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao salvar candidatura',
          details: error.message,
          hint: error.hint || 'Verifique se todos os campos obrigatórios foram preenchidos corretamente'
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ [PARTNERSHIP] Candidatura inserida com sucesso:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Candidatura enviada com sucesso!',
        application: {
          id: data.id,
          email: data.email_profissional,
          submitted_at: data.data_candidatura
        }
      }), 
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 [PARTNERSHIP] Erro geral:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error.message,
        details: 'Por favor, tente novamente ou entre em contato com o suporte'
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
