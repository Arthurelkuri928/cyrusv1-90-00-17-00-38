
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MigrationResult {
  success: boolean;
  migratedCount: number;
  errors: string[];
  details: any[];
}

export const useCookieMigration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);

  const migrateCookiesToCredentials = async (): Promise<MigrationResult> => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Iniciando migração de cookies...');
      
      // 1. Buscar todas as ferramentas que têm cookies no campo tools.cookies
      const { data: toolsWithCookies, error: fetchError } = await supabase
        .from('tools')
        .select('id, name, cookies')
        .not('cookies', 'is', null)
        .neq('cookies', '');

      if (fetchError) {
        throw new Error(`Erro ao buscar ferramentas: ${fetchError.message}`);
      }

      if (!toolsWithCookies || toolsWithCookies.length === 0) {
        const result: MigrationResult = {
          success: true,
          migratedCount: 0,
          errors: [],
          details: []
        };
        setMigrationResult(result);
        return result;
      }

      console.log(`📊 Encontradas ${toolsWithCookies.length} ferramentas com cookies para migrar`);

      let migratedCount = 0;
      const errors: string[] = [];
      const details: any[] = [];

      for (const tool of toolsWithCookies) {
        try {
          console.log(`🔄 Migrando cookies da ferramenta: ${tool.name} (ID: ${tool.id})`);

          // 2. Verificar se já existe credencial de cookie para esta ferramenta
          const { data: existingCredentials } = await supabase
            .from('tool_credentials')
            .select('credentials')
            .eq('tool_id', String(tool.id))
            .single();

          let currentCredentials = [];
          if (existingCredentials?.credentials && Array.isArray(existingCredentials.credentials)) {
            currentCredentials = existingCredentials.credentials;
          }

          // Verificar se já existe credencial do tipo 'cookie'
          const hasExistingCookie = currentCredentials.some((cred: any) => cred.type === 'cookie');
          
          if (hasExistingCookie) {
            console.log(`⚠️ Ferramenta ${tool.name} já possui credencial de cookie, pulando...`);
            details.push({
              toolId: tool.id,
              toolName: tool.name,
              action: 'skipped',
              reason: 'Cookie credential already exists'
            });
            continue;
          }

          // 3. Criar nova credencial de cookie
          const newCookieCredential = {
            type: 'cookie',
            label: 'Cookies de Sessão',
            value: tool.cookies
          };

          const updatedCredentials = [...currentCredentials, newCookieCredential];

          // 4. Atualizar ou inserir na tabela tool_credentials
          if (existingCredentials) {
            // Atualizar registro existente
            const { error: updateError } = await supabase
              .from('tool_credentials')
              .update({ 
                credentials: updatedCredentials,
                updated_at: new Date().toISOString()
              })
              .eq('tool_id', String(tool.id));

            if (updateError) throw updateError;
          } else {
            // Inserir novo registro
            const { error: insertError } = await supabase
              .from('tool_credentials')
              .insert({
                tool_id: String(tool.id),
                credentials: updatedCredentials
              });

            if (insertError) throw insertError;
          }

          // 5. Limpar o campo tools.cookies após migração bem-sucedida
          const { error: clearError } = await supabase
            .from('tools')
            .update({ cookies: null })
            .eq('id', tool.id);

          if (clearError) {
            console.warn(`⚠️ Não foi possível limpar cookies da ferramenta ${tool.name}:`, clearError);
          }

          migratedCount++;
          details.push({
            toolId: tool.id,
            toolName: tool.name,
            action: 'migrated',
            cookieLength: tool.cookies.length
          });

          console.log(`✅ Cookies migrados com sucesso para ${tool.name}`);

        } catch (toolError) {
          const errorMsg = `Erro na migração da ferramenta ${tool.name}: ${toolError}`;
          console.error('❌', errorMsg);
          errors.push(errorMsg);
          
          details.push({
            toolId: tool.id,
            toolName: tool.name,
            action: 'failed',
            error: String(toolError)
          });
        }
      }

      const result: MigrationResult = {
        success: errors.length === 0,
        migratedCount,
        errors,
        details
      };

      setMigrationResult(result);
      
      if (result.success) {
        toast.success(`✅ Migração concluída! ${migratedCount} ferramenta(s) migrada(s)`);
        console.log('🎉 Migração de cookies concluída com sucesso:', result);
      } else {
        toast.error(`⚠️ Migração concluída com ${errors.length} erro(s)`);
        console.error('💥 Migração concluída com erros:', result);
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      const result: MigrationResult = {
        success: false,
        migratedCount: 0,
        errors: [errorMessage],
        details: []
      };
      
      setMigrationResult(result);
      toast.error(`❌ Erro na migração: ${errorMessage}`);
      console.error('💥 Erro crítico na migração:', error);
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetMigrationState = () => {
    setMigrationResult(null);
  };

  return {
    isLoading,
    migrationResult,
    migrateCookiesToCredentials,
    resetMigrationState
  };
};
