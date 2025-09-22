
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { jsPDF } from "https://esm.sh/jspdf@2.5.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 [generate-affiliate-statement] Iniciando processamento...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('❌ Token de autorização não fornecido');
      return new Response(
        JSON.stringify({ error: 'Token de autorização obrigatório' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.log('❌ Erro de autenticação:', authError);
      return new Response(
        JSON.stringify({ error: 'Token inválido ou expirado' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Usuário autenticado:', user.id);

    // Verificar se é afiliado ou admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.log('❌ Erro ao buscar perfil do usuário:', profileError);
      return new Response(
        JSON.stringify({ error: 'Perfil do usuário não encontrado' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const isAdmin = ['admin_master', 'gestor_operacoes'].includes(profile.role?.trim());
    console.log('👤 Perfil do usuário:', { role: profile.role, isAdmin });

    // Buscar dados de vendas do afiliado
    let salesQuery = supabase
      .from('affiliate_sales')
      .select('*')
      .order('sale_date', { ascending: false });

    // Se não for admin, filtrar apenas as vendas do próprio usuário
    if (!isAdmin) {
      salesQuery = salesQuery.eq('user_id', user.id);
    }

    const { data: sales, error: salesError } = await salesQuery;

    if (salesError) {
      console.log('❌ Erro ao buscar vendas:', salesError);
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar dados de vendas' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`📊 Total de vendas encontradas: ${sales?.length || 0}`);

    // Gerar PDF
    const pdfBuffer = await generateAffiliatePDF(user, sales || [], profile.role);

    console.log('✅ PDF gerado com sucesso');

    // Retornar o PDF
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="extrato-afiliado-${user.id.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.pdf"`,
      },
    });

  } catch (error) {
    console.error('💥 Erro geral na função:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

/**
 * Gera o PDF do extrato de vendas do afiliado usando jsPDF
 */
async function generateAffiliatePDF(user: any, sales: any[], userRole: string): Promise<ArrayBuffer> {
  try {
    console.log('📄 Iniciando geração do PDF...');
    
    // Criar nova instância do jsPDF
    const doc = new jsPDF();
    
    // Configurar fonte
    doc.setFont("helvetica");
    
    // Cabeçalho do documento
    doc.setFontSize(18);
    doc.text('EXTRATO DE VENDAS - AFILIADO', 20, 30);
    
    // Informações do relatório
    doc.setFontSize(12);
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const reportPeriod = sales.length > 0 
      ? `${new Date(sales[sales.length - 1].sale_date).toLocaleDateString('pt-BR')} - ${new Date(sales[0].sale_date).toLocaleDateString('pt-BR')}`
      : 'Sem vendas no período';
    
    doc.text(`Data do Relatório: ${currentDate}`, 20, 50);
    doc.text(`Período: ${reportPeriod}`, 20, 60);
    doc.text(`Usuário ID: ${user.id.slice(0, 8)}...`, 20, 70);
    doc.text(`Role: ${userRole}`, 20, 80);
    
    // Calcular totais
    const totalSales = sales.length;
    const totalAmount = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || '0'), 0);
    const totalCommission = sales.reduce((sum, sale) => sum + parseFloat(sale.commission_amount || '0'), 0);
    
    // Resumo geral
    doc.setFontSize(14);
    doc.text('RESUMO GERAL', 20, 100);
    
    doc.setFontSize(10);
    doc.text(`Total de Vendas: ${totalSales}`, 20, 115);
    doc.text(`Valor Total das Vendas: R$ ${totalAmount.toFixed(2)}`, 20, 125);
    doc.text(`Total de Comissões: R$ ${totalCommission.toFixed(2)}`, 20, 135);
    
    // Agrupar vendas por status
    const statusGroups = sales.reduce((groups, sale) => {
      const status = sale.status || 'unknown';
      if (!groups[status]) groups[status] = [];
      groups[status].push(sale);
      return groups;
    }, {});
    
    // Vendas por status
    doc.setFontSize(12);
    doc.text('VENDAS POR STATUS', 20, 155);
    
    let yPos = 170;
    doc.setFontSize(10);
    Object.entries(statusGroups).forEach(([status, statusSales]: [string, any]) => {
      const statusCommission = statusSales.reduce((sum: number, s: any) => sum + parseFloat(s.commission_amount || '0'), 0);
      doc.text(`${status.toUpperCase()}: ${statusSales.length} vendas - R$ ${statusCommission.toFixed(2)}`, 20, yPos);
      yPos += 10;
    });
    
    // Detalhes das vendas (primeiras 10)
    yPos += 20;
    doc.setFontSize(12);
    doc.text('DETALHES DAS VENDAS', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(9);
    sales.slice(0, 10).forEach((sale, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(`${index + 1}. Pedido: ${sale.order_id || 'N/A'}`, 20, yPos);
      yPos += 8;
      doc.text(`   Produto: ${sale.product_name || 'N/A'}`, 20, yPos);
      yPos += 8;
      doc.text(`   Data: ${new Date(sale.sale_date).toLocaleDateString('pt-BR')}`, 20, yPos);
      yPos += 8;
      doc.text(`   Valor: R$ ${parseFloat(sale.amount || '0').toFixed(2)} | Comissão: R$ ${parseFloat(sale.commission_amount || '0').toFixed(2)}`, 20, yPos);
      yPos += 8;
      doc.text(`   Status: ${sale.status || 'N/A'}`, 20, yPos);
      yPos += 12;
    });
    
    if (sales.length > 10) {
      doc.text(`... e mais ${sales.length - 10} vendas`, 20, yPos);
    }
    
    // Gerar buffer do PDF
    const pdfBuffer = doc.output('arraybuffer');
    
    console.log('✅ PDF gerado com sucesso, tamanho:', pdfBuffer.byteLength, 'bytes');
    
    return pdfBuffer;
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    throw new Error(`Falha na geração do PDF: ${error.message}`);
  }
}
