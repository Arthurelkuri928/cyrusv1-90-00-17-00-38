
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

const ValidationTestComponent = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const { toast } = useToast();

  const runValidationTests = async () => {
    console.log('🚀 [VALIDATION] Iniciando testes de validação da Fase 1...');
    setIsRunning(true);
    setTestResults([]);
    
    const results: any[] = [];

    // Teste 1: Envio de dados válidos
    try {
      console.log('📝 [VALIDATION] Teste 1: Enviando dados válidos...');
      
      const validData = {
        nome_completo: "João Silva Teste",
        email_profissional: "joao.teste@email.com",
        whatsapp: "(11) 99999-9999",
        plataforma: "instagram",
        numero_seguidores: "10k-50k",
        area_atuacao_principal: "marketing",
        experiencia_afiliacao: "intermediate",
        motivo_parceria: "Quero me tornar parceiro para expandir minha atuação no mercado digital",
        link_perfil_principal: "https://instagram.com/joaoteste"
      };

      const { data, error } = await supabase.functions.invoke('submit-partnership-application', {
        body: validData
      });

      if (error) {
        results.push({
          test: "Envio de dados válidos",
          status: "failed",
          message: `Erro: ${error.message}`,
          details: error
        });
      } else {
        results.push({
          test: "Envio de dados válidos",
          status: "passed",
          message: "Dados inseridos com sucesso na tabela",
          details: data
        });
      }
    } catch (error: any) {
      results.push({
        test: "Envio de dados válidos",
        status: "failed",
        message: `Erro inesperado: ${error.message}`,
        details: error
      });
    }

    // Teste 2: Validação de email inválido
    try {
      console.log('📝 [VALIDATION] Teste 2: Testando validação de email inválido...');
      
      const invalidEmailData = {
        nome_completo: "Maria Silva Teste",
        email_profissional: "email-invalido",
        whatsapp: "(11) 88888-8888",
        plataforma: "youtube",
        numero_seguidores: "5k-10k",
        area_atuacao_principal: "business",
        experiencia_afiliacao: "beginner",
        motivo_parceria: "Teste de validação",
        link_perfil_principal: ""
      };

      const { data, error } = await supabase.functions.invoke('submit-partnership-application', {
        body: invalidEmailData
      });

      if (error && error.message.includes('Email')) {
        results.push({
          test: "Validação de email inválido",
          status: "passed",
          message: "Validação de email funcionando corretamente",
          details: error.message
        });
      } else {
        results.push({
          test: "Validação de email inválido",
          status: "failed",
          message: "Validação de email não está funcionando",
          details: { data, error }
        });
      }
    } catch (error: any) {
      results.push({
        test: "Validação de email inválido",
        status: "failed",
        message: `Erro inesperado: ${error.message}`,
        details: error
      });
    }

    // Teste 3: Validação de campos obrigatórios
    try {
      console.log('📝 [VALIDATION] Teste 3: Testando validação de campos obrigatórios...');
      
      const incompleteData = {
        nome_completo: "",
        email_profissional: "teste@email.com",
        // Campos obrigatórios faltando intencionalmente
      };

      const { data, error } = await supabase.functions.invoke('submit-partnership-application', {
        body: incompleteData
      });

      if (error && error.message.includes('obrigatórios')) {
        results.push({
          test: "Validação de campos obrigatórios",
          status: "passed",
          message: "Validação de campos obrigatórios funcionando",
          details: error.message
        });
      } else {
        results.push({
          test: "Validação de campos obrigatórios",
          status: "failed",
          message: "Validação de campos obrigatórios não está funcionando",
          details: { data, error }
        });
      }
    } catch (error: any) {
      results.push({
        test: "Validação de campos obrigatórios",
        status: "failed",
        message: `Erro inesperado: ${error.message}`,
        details: error
      });
    }

    // Teste 4: Verificar dados na tabela
    try {
      console.log('📝 [VALIDATION] Teste 4: Verificando dados na tabela...');
      
      // Fazer uma consulta para verificar se os dados estão sendo inseridos
      const { data: tableData, error: tableError } = await supabase
        .from('partnership_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (tableError) {
        results.push({
          test: "Verificação da tabela",
          status: "failed",
          message: `Erro ao consultar tabela: ${tableError.message}`,
          details: tableError
        });
      } else {
        results.push({
          test: "Verificação da tabela",
          status: "passed",
          message: `Tabela acessível. Último registro: ${tableData?.[0]?.nome_completo || 'Nenhum'}`,
          details: tableData?.[0]
        });
      }
    } catch (error: any) {
      results.push({
        test: "Verificação da tabela",
        status: "failed",
        message: `Erro inesperado: ${error.message}`,
        details: error
      });
    }

    setTestResults(results);
    setIsRunning(false);
    
    const passedTests = results.filter(r => r.status === 'passed').length;
    const totalTests = results.length;
    
    console.log(`✅ [VALIDATION] Testes concluídos: ${passedTests}/${totalTests} passaram`);
    
    if (passedTests === totalTests) {
      toast({
        title: "✅ Fase 1 Validada com Sucesso!",
        description: `Todos os ${totalTests} testes passaram. Backend está funcionando perfeitamente.`,
      });
    } else {
      toast({
        title: "⚠️ Alguns testes falharam",
        description: `${passedTests}/${totalTests} testes passaram. Verifique os detalhes.`,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'border-green-500/30 bg-green-500/10';
      case 'failed':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-yellow-500/30 bg-yellow-500/10';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          Validação Final - Fase 1: Sistema de Afiliados
        </h2>
        <p className="text-gray-300 mb-6">
          Teste completo do backend: tabela, Edge Function e validações de segurança
        </p>
        
        <Button 
          onClick={runValidationTests}
          disabled={isRunning}
          className="bg-gradient-to-r from-[#B388FF] to-[#8E24AA] hover:from-[#8E24AA] hover:to-[#B388FF] text-white"
        >
          {isRunning ? "Executando Testes..." : "Iniciar Validação da Fase 1"}
        </Button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">Resultados dos Testes:</h3>
          
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
            >
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(result.status)}
                <h4 className="font-semibold text-white">{result.test}</h4>
              </div>
              
              <p className="text-gray-300 mb-2">{result.message}</p>
              
              {result.details && (
                <details className="mt-2">
                  <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                    Ver detalhes técnicos
                  </summary>
                  <pre className="mt-2 text-xs text-gray-500 bg-black/20 p-2 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-black/40 border border-[#8E24AA]/30 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Resumo da Validação:</h4>
            <div className="text-gray-300">
              <p>✅ Testes Aprovados: {testResults.filter(r => r.status === 'passed').length}</p>
              <p>❌ Testes Falharam: {testResults.filter(r => r.status === 'failed').length}</p>
              <p>📊 Total de Testes: {testResults.length}</p>
            </div>
            
            {testResults.filter(r => r.status === 'passed').length === testResults.length && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded">
                <p className="text-green-400 font-semibold">
                  🎉 FASE 1 COMPLETAMENTE VALIDADA!
                </p>
                <p className="text-green-300 text-sm mt-1">
                  Backend está funcionando perfeitamente. Pronto para Fase 2.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-black/20 border border-[#8E24AA]/20 rounded-lg">
        <h4 className="font-semibold text-white mb-2">O que está sendo testado:</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Inserção de dados válidos na tabela partnership_applications</li>
          <li>• Validação de email inválido (segurança)</li>
          <li>• Validação de campos obrigatórios (segurança)</li>
          <li>• Acesso e consulta à tabela do banco de dados</li>
        </ul>
      </div>
    </div>
  );
};

export default ValidationTestComponent;
