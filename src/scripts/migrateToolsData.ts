/**
 * Script de Migração dos Dados Visuais das Ferramentas
 * 
 * Este script migra os dados do array toolsData (arquivo estático) 
 * para a tabela tools no Supabase, garantindo que não há duplicatas.
 */

import { supabase } from '@/integrations/supabase/client';
import { SupabaseToolsRepository } from '@/infrastructure/repositories/tools.repository';

// Dados visuais originais do arquivo estático
const toolsDataForMigration = [
  // Design/Creation Tools
  {
    id: 1,
    title: "Canva Pro",
    logoImage: "https://i.postimg.cc/TyJdn3w3/CANVA-PRO.png",
    bgColor: "#2A0B3B",
    textColor: "white",
    status: "online" as const,
    category: "Design/Criação"
  },
  {
    id: 2,
    title: "Adobe Stock",
    logoImage: "https://i.postimg.cc/t7CTtWFQ/ADOBE-STOCK.png",
    bgColor: "#E8E3FB",
    textColor: "black",
    status: "online" as const,
    category: "Design/Criação"
  },
  {
    id: 3,
    title: "Flaticon",
    logoImage: "https://i.postimg.cc/hz8dznFL/FLATICON.png",
    bgColor: "#001421",
    textColor: "white",
    status: "online" as const,
    category: "Design/Criação"
  },
  {
    id: 4,
    title: "Envato Elements",
    logoImage: "https://i.postimg.cc/68TnHFRK/ENVATO-ELEMENTS.png",
    bgColor: "#1E2609",
    textColor: "white",
    status: "online" as const,
    category: "Design/Criação"
  },
  {
    id: 5,
    title: "Freepik",
    logoImage: "https://i.postimg.cc/LhRfdJfN/FREEPIK.png",
    bgColor: "#001F49",
    textColor: "white",
    status: "online" as const,
    category: "Design/Criação"
  },
  {
    id: 6,
    title: "Storyblocks",
    logoImage: "https://i.postimg.cc/JDKhCzV2/STORYBLOCKS.png",
    bgColor: "#FFE53D",
    textColor: "black",
    status: "online" as const,
    category: "Design/Criação"
  },
  {
    id: 7,
    title: "CapCut Pro",
    logoImage: "https://i.postimg.cc/9DTFFpHT/CAPCUT-PRO.png",
    bgColor: "#E4E4E4",
    textColor: "black",
    status: "online" as const,
    category: "Design/Criação"
  },
  {
    id: 9,
    title: "LovePik",
    logoImage: "https://i.postimg.cc/jDWn6P0d/LOVEPIK.png",
    bgColor: "#081824",
    textColor: "white",
    status: "online" as const,
    category: "Design/Criação"
  },
  {
    id: 10,
    title: "Vectorizer",
    logoImage: "https://i.postimg.cc/FdhK6JqS/VECTORIZER.png",
    bgColor: "#1B22A3",
    textColor: "white",
    status: "online" as const,
    category: "Design/Criação"
  },
  {
    id: 11,
    title: "Epidemic Sound",
    logoImage: "https://i.postimg.cc/rDbW7gCr/EPIDEMIC-SOUND.png",
    bgColor: "#FFFFFF",
    textColor: "black",
    status: "online" as const,
    category: "Design/Criação"
  },
  
  // AI Tools
  {
    id: 12,
    title: "ChatGPT 4.0",
    logoImage: "https://i.postimg.cc/Q9NXmZ9k/CHAT-GPT.png",
    bgColor: "#000000",
    textColor: "white",
    status: "online" as const,
    category: "IA"
  },
  {
    id: 13,
    title: "Midjourney",
    logoImage: "https://i.postimg.cc/k6CVdHVB/MIDJOURNEY.png",
    bgColor: "#FFFFFF",
    textColor: "black",
    status: "online" as const,
    category: "IA"
  },
  {
    id: 14,
    title: "Leonardo AI",
    logoImage: "https://i.postimg.cc/nX6j3rpK/LEONARD-IA.png",
    bgColor: "#260F2B",
    textColor: "white",
    status: "online" as const,
    category: "IA"
  },
  {
    id: 15,
    title: "Gamma App",
    logoImage: "https://i.postimg.cc/4mx9djWc/GAMMA-APP.png",
    bgColor: "#23042E",
    textColor: "white",
    status: "online" as const,
    category: "IA"
  },
  {
    id: 16,
    title: "HeyGen",
    logoImage: "https://i.postimg.cc/56KFFprR/HEYGEN.png",
    bgColor: "#1A102B",
    textColor: "white",
    status: "online" as const,
    category: "IA"
  },
  {
    id: 17,
    title: "ChatBot X",
    logoImage: "https://i.postimg.cc/Pp6dFV1G/CHATBOT-X.png",
    bgColor: "#FFFFFF",
    textColor: "black",
    status: "maintenance" as const,
    category: "IA"
  },
  {
    id: 18,
    title: "Claude AI",
    logoImage: "https://i.postimg.cc/m1tTx3SP/CLAUDE-IA.png",
    bgColor: "#5A2F13",
    textColor: "white",
    status: "online" as const,
    category: "IA"
  },
  {
    id: 19,
    title: "Dreamface",
    logoImage: "https://i.postimg.cc/ThqVhVGz/DREAMFACE.png",
    bgColor: "#42F7A2",
    textColor: "black",
    status: "online" as const,
    category: "IA"
  },
  {
    id: 20,
    title: "Grok",
    logoImage: "https://i.postimg.cc/XX85nnk3/GROK.png",
    bgColor: "#FFFFFF",
    textColor: "black",
    status: "online" as const,
    category: "IA"
  },
];

interface MigrationResult {
  success: boolean;
  totalProcessed: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: Array<{ id: number; title: string; error: string }>;
}

/**
 * Mapeia os dados visuais para o formato do Supabase
 */
function mapVisualToolToSupabase(visualTool: any) {
  return {
    id: visualTool.id,
    name: visualTool.title,
    description: `Ferramenta de ${visualTool.category}`,
    category: visualTool.category,
    card_color: visualTool.bgColor,
    logo_url: visualTool.logoImage,
    is_active: visualTool.status === 'online',
    is_maintenance: visualTool.status === 'maintenance',
    slug: visualTool.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
  };
}

/**
 * Executa a migração dos dados visuais para o Supabase
 */
export async function migrateToolsData(): Promise<MigrationResult> {
  console.log('🚀 === INICIANDO MIGRAÇÃO DE DADOS VISUAIS ===');
  
  const repository = new SupabaseToolsRepository();
  const result: MigrationResult = {
    success: false,
    totalProcessed: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: []
  };

  try {
    // Buscar ferramentas existentes no Supabase
    console.log('📊 Buscando ferramentas existentes no Supabase...');
    const existingTools = await repository.getAll();
    const existingToolsMap = new Map(existingTools.map(tool => [Number(tool.id), tool]));
    
    console.log(`📋 Total de ferramentas visuais para processar: ${toolsDataForMigration.length}`);
    console.log(`💾 Total de ferramentas existentes no Supabase: ${existingTools.length}`);

    // Processar cada ferramenta visual
    for (const visualTool of toolsDataForMigration) {
      result.totalProcessed++;
      
      try {
        const mappedTool = mapVisualToolToSupabase(visualTool);
        const existingTool = existingToolsMap.get(visualTool.id);

        if (existingTool) {
          // Atualizar campos visuais se necessário
          const needsUpdate = 
            existingTool.card_color !== mappedTool.card_color ||
            existingTool.logo_url !== mappedTool.logo_url ||
            existingTool.description !== mappedTool.description ||
            existingTool.category !== mappedTool.category;

          if (needsUpdate) {
            console.log(`🔄 Atualizando ferramenta existente: ${visualTool.title} (ID: ${visualTool.id})`);
            await repository.updateTool(visualTool.id, {
              card_color: mappedTool.card_color,
              logo_url: mappedTool.logo_url,
              description: mappedTool.description,
              category: mappedTool.category
            });
            result.updated++;
          } else {
            console.log(`⏭️ Ferramenta já atualizada: ${visualTool.title} (ID: ${visualTool.id})`);
            result.skipped++;
          }
        } else {
          // Inserir nova ferramenta
          console.log(`➕ Inserindo nova ferramenta: ${visualTool.title} (ID: ${visualTool.id})`);
          await repository.upsertTool(mappedTool);
          result.inserted++;
        }

      } catch (error) {
        console.error(`❌ Erro ao processar ferramenta ${visualTool.title}:`, error);
        result.errors.push({
          id: visualTool.id,
          title: visualTool.title,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    result.success = result.errors.length === 0;
    
    console.log('✅ === MIGRAÇÃO CONCLUÍDA ===');
    console.log(`📊 Resultado da migração:`);
    console.log(`   - Total processado: ${result.totalProcessed}`);
    console.log(`   - Inseridas: ${result.inserted}`);
    console.log(`   - Atualizadas: ${result.updated}`);
    console.log(`   - Ignoradas: ${result.skipped}`);
    console.log(`   - Erros: ${result.errors.length}`);
    
    if (result.errors.length > 0) {
      console.log('❌ Erros encontrados:');
      result.errors.forEach(error => {
        console.log(`   - ${error.title} (ID: ${error.id}): ${error.error}`);
      });
    }

    return result;

  } catch (error) {
    console.error('💥 Erro geral na migração:', error);
    result.success = false;
    return result;
  }
}

/**
 * Função utilitária para executar a migração via console do navegador
 * Uso: await window.runToolsMigration()
 */
export function setupMigrationForBrowser() {
  if (typeof window !== 'undefined') {
    (window as any).runToolsMigration = migrateToolsData;
    console.log('🔧 Migração configurada! Execute: await window.runToolsMigration()');
  }
}

// Executar automaticamente no modo desenvolvimento
if (import.meta.env.DEV) {
  setupMigrationForBrowser();
}