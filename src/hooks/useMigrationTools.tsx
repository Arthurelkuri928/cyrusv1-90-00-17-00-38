/**
 * Hook para executar a migração de dados visuais das ferramentas
 */

import { useState } from 'react';
import { migrateToolsData } from '@/scripts/migrateToolsData';
import { toast } from 'sonner';

interface MigrationState {
  isLoading: boolean;
  isCompleted: boolean;
  result: any | null;
  error: string | null;
}

export const useMigrationTools = () => {
  const [state, setState] = useState<MigrationState>({
    isLoading: false,
    isCompleted: false,
    result: null,
    error: null
  });

  const runMigration = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('🚀 Iniciando migração de dados visuais...');
      toast.info('Iniciando migração de dados visuais...');
      
      const result = await migrateToolsData();
      
      setState({
        isLoading: false,
        isCompleted: true,
        result,
        error: null
      });

      if (result.success) {
        toast.success(`Migração concluída! ${result.inserted} inseridas, ${result.updated} atualizadas`);
        console.log('✅ Migração concluída com sucesso:', result);
      } else {
        toast.error(`Migração concluída com ${result.errors.length} erro(s)`);
        console.error('⚠️ Migração concluída com erros:', result);
      }

      return result;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setState({
        isLoading: false,
        isCompleted: true,
        result: null,
        error: errorMessage
      });
      
      toast.error(`Erro na migração: ${errorMessage}`);
      console.error('💥 Erro na migração:', error);
      
      throw error;
    }
  };

  const resetState = () => {
    setState({
      isLoading: false,
      isCompleted: false,
      result: null,
      error: null
    });
  };

  return {
    ...state,
    runMigration,
    resetState
  };
};