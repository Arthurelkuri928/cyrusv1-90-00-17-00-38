
import { Tool } from '@/shared/types/tool';
import { ToolCardProps } from '@/components/member/ToolCard';

/**
 * Calculate contrasting text color based on background color luminance
 */
export function getContrastingTextColor(hexColor: string): 'white' | 'black' {
  if (!hexColor || hexColor === 'transparent') return 'black';
  
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance using standard formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return contrasting color
  return luminance > 0.5 ? 'black' : 'white';
}

/**
 * Segregate tools into normal and maintenance categories
 */
export function segregateToolsByMaintenance(tools: Tool[]) {
  const normalTools = tools.filter(tool => !tool.is_maintenance);
  const maintenanceTools = tools.filter(tool => tool.is_maintenance === true);
  
  return {
    normalTools,
    maintenanceTools,
    // Combined list with maintenance tools at the end
    orderedTools: [...normalTools, ...maintenanceTools]
  };
}

/**
 * Map Supabase Tool to ToolCardProps for UI components
 */
export function mapToolToCardProps(tool: Tool): ToolCardProps {
  const bgColor = tool.card_color || '#3B82F6';
  
  // Override category for maintenance tools
  const displayCategory = tool.is_maintenance ? 'Manutenção' : (tool.category || 'Diversos');
  
  return {
    id: Number(tool.id),
    title: tool.name,
    logoImage: tool.logo_url || tool.name.charAt(0),
    bgColor,
    textColor: getContrastingTextColor(bgColor),
    status: tool.is_maintenance ? 'maintenance' : 
             tool.is_active ? 'online' : 'offline',
    category: displayCategory
  };
}
