import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  id_transacao: string;
}

interface PaymentRecord {
  id_transacao: string;
  id_usuario: string;
  valor_pago: number;
  moeda: string;
  data_pagamento: string;
  status_pagamento: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🧾 Starting subscription invoice generation...');
    console.log('📋 Request method:', req.method);

    // Verificar se é POST
    if (req.method !== 'POST') {
      console.warn('⚠️ Invalid method:', req.method);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obter token de autorização
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.warn('⚠️ No authorization header');
      return new Response(
        JSON.stringify({ error: 'Token de autorização necessário' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔑 Authorization header found');

    // Inicializar cliente Supabase com service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Cliente para verificação de auth
    const supabaseAuth = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });

    // Cliente com service role para acesso aos dados
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar usuário autenticado
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.warn('⚠️ Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ User authenticated:', user.id);

    // Parse do body com tratamento robusto de erros
    let body: RequestBody;
    try {
      const textBody = await req.text();
      console.log('📝 Raw body received:', textBody);
      
      if (!textBody || textBody.trim() === '') {
        throw new Error('Empty request body');
      }
      
      body = JSON.parse(textBody);
      console.log('✅ JSON parsed successfully:', body);
      
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Formato de dados inválido', 
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar dados obrigatórios
    if (!body.id_transacao) {
      console.warn('⚠️ Missing id_transacao');
      return new Response(
        JSON.stringify({ error: 'id_transacao é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔍 Searching for transaction:', body.id_transacao);
    console.log('🔍 User ID:', user.id);

    // Buscar registro usando service role (sem RLS) mas verificando o usuário
    const { data: payment, error: dbError } = await supabaseAdmin
      .from('assinaturas_pagamentos')
      .select('*')
      .eq('id_transacao', body.id_transacao)
      .eq('id_usuario', user.id) // Filtrar pelo usuário autenticado
      .single();

    console.log('🔍 Query result - payment:', payment);
    console.log('🔍 Query result - error:', dbError);

    if (dbError) {
      console.error('❌ Database error:', dbError.message);
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar dados da fatura', details: dbError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!payment) {
      console.warn('⚠️ Payment not found for transaction:', body.id_transacao);
      return new Response(
        JSON.stringify({ 
          error: 'Fatura não encontrada ou você não tem permissão para acessá-la',
          requested_transaction: body.id_transacao,
          user_id: user.id
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Payment record found for user:', payment.id_usuario);

    // Gerar PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Header com marca e logo
    page.drawRectangle({
      x: 0,
      y: 792,
      width: 595,
      height: 50,
      color: rgb(0.663, 0.333, 0.969) // Cor roxa da marca
    });

    // Nome da empresa/plataforma
    page.drawText('CYRUS', {
      x: 50,
      y: 810,
      size: 24,
      font: boldFont,
      color: rgb(1, 1, 1)
    });

    page.drawText('Plataforma de Ferramentas Premium', {
      x: 50,
      y: 795,
      size: 10,
      font: font,
      color: rgb(1, 1, 1)
    });

    // Cabeçalho principal
    page.drawText('FATURA DE ASSINATURA', {
      x: 50,
      y: 750,
      size: 20,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2)
    });

    // Número da fatura (usando parte do ID da transação)
    const invoiceNumber = `#${payment.id_transacao.substring(0, 8).toUpperCase()}`;
    page.drawText(`Fatura ${invoiceNumber}`, {
      x: 400,
      y: 750,
      size: 12,
      font: boldFont,
      color: rgb(0.4, 0.4, 0.4)
    });

    // Linha separadora
    page.drawLine({
      start: { x: 50, y: 730 },
      end: { x: 545, y: 730 },
      thickness: 2,
      color: rgb(0.663, 0.333, 0.969)
    });

    // Informações da transação
    let yPos = 680;
    const lineHeight = 25;

    const addLine = (label: string, value: string) => {
      page.drawText(`${label}:`, {
        x: 50,
        y: yPos,
        size: 12,
        font: boldFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      page.drawText(value, {
        x: 200,
        y: yPos,
        size: 12,
        font: font,
        color: rgb(0.1, 0.1, 0.1)
      });
      
      yPos -= lineHeight;
    };

    // Formatação de dados
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const formatCurrency = (value: number, currency: string) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency
      }).format(value);
    };

    const getStatusLabel = (status: string) => {
      const labels: { [key: string]: string } = {
        'pago': 'PAGO',
        'pendente': 'PENDENTE',
        'falha': 'FALHA NO PAGAMENTO'
      };
      return labels[status] || status.toUpperCase();
    };

    // Adicionar linhas de informação
    addLine('ID da Transação', payment.id_transacao);
    addLine('Valor Pago', formatCurrency(payment.valor_pago, payment.moeda));
    addLine('Data do Pagamento', formatDate(payment.data_pagamento));
    addLine('Status', getStatusLabel(payment.status_pagamento));

    // Box com destaque para o valor
    const boxY = yPos - 40;
    page.drawRectangle({
      x: 50,
      y: boxY,
      width: 495,
      height: 60,
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 1,
      color: rgb(0.95, 0.95, 0.95)
    });

    page.drawText('VALOR TOTAL PAGO', {
      x: 60,
      y: boxY + 35,
      size: 14,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2)
    });

    page.drawText(formatCurrency(payment.valor_pago, payment.moeda), {
      x: 60,
      y: boxY + 10,
      size: 18,
      font: boldFont,
      color: rgb(0.1, 0.5, 0.1)
    });

    // Rodapé com informações da empresa
    const footerY = 120;
    page.drawLine({
      start: { x: 50, y: footerY + 40 },
      end: { x: 545, y: footerY + 40 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    });

    page.drawText('CYRUS - Plataforma de Ferramentas Premium', {
      x: 50,
      y: footerY + 20,
      size: 12,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3)
    });

    page.drawText('Suporte: suporte@cyrus.com | WhatsApp: +55 (11) 99999-9999', {
      x: 50,
      y: footerY + 5,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });

    page.drawText(`Fatura gerada em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, {
      x: 50,
      y: footerY - 10,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });

    // Seção de observações
    const observationsY = 220;
    page.drawText('OBSERVAÇÕES:', {
      x: 50,
      y: observationsY,
      size: 12,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3)
    });

    page.drawText('• Esta fatura comprova o pagamento da assinatura premium CYRUS', {
      x: 50,
      y: observationsY - 20,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });

    page.drawText('• Acesso às ferramentas premium válido durante o período de assinatura', {
      x: 50,
      y: observationsY - 35,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });

    page.drawText('• Para dúvidas ou suporte, entre em contato através dos canais abaixo', {
      x: 50,
      y: observationsY - 50,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });

    // Mensagem de agradecimento
    page.drawText('Obrigado por ser nosso cliente premium!', {
      x: 50,
      y: footerY - 30,
      size: 10,
      font: font,
      color: rgb(0.663, 0.333, 0.969)
    });

    // Gerar PDF final
    const pdfBytes = await pdfDoc.save();

    console.log('✅ PDF generated successfully, size:', pdfBytes.length, 'bytes');

    // Retornar PDF como binary data
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBytes.length.toString(),
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('💥 Error generating invoice PDF:', error);
    
    // Log detalhado do erro para facilitar debug
    console.error('🔍 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      type: typeof error
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
