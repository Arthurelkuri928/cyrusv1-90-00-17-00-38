
import React, { memo, useCallback } from 'react';
import { Card, Badge, Button } from '@/design-system';
import { useToolsStore } from '@/app/store/tools.store';
import { Tool } from '@/shared/types/tool';
import { Heart, ExternalLink } from 'lucide-react';

interface OptimizedToolCardProps {
  tool: Tool;
  onNavigate?: (toolId: string | number) => void;
}

const OptimizedToolCard = memo(({ tool, onNavigate }: OptimizedToolCardProps) => {
  const { addToFavorites, removeFromFavorites } = useToolsStore();
  
  const handleFavoriteClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (tool.isFavorite) {
        await removeFromFavorites(tool.id);
      } else {
        await addToFavorites(tool.id);
      }
    } catch (error) {
      console.warn('Failed to update favorite status:', error);
    }
  }, [tool.isFavorite, tool.id, addToFavorites, removeFromFavorites]);

  const handleCardClick = useCallback(() => {
    if (onNavigate) {
      onNavigate(tool.id);
    }
  }, [tool.id, onNavigate]);

  const handleExternalClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (tool.access_url) {
      window.open(tool.access_url, '_blank', 'noopener,noreferrer');
    }
  }, [tool.access_url]);

  const statusVariant = React.useMemo(() => {
    switch (tool.status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'inactive': return 'destructive';
      default: return 'secondary';
    }
  }, [tool.status]);

  const getStatusColor = () => {
    switch (tool.status) {
      case 'active': return 'bg-green-500 text-white';
      case 'maintenance': return 'bg-orange-500 text-white';
      case 'inactive': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card 
      variant="cyrus" 
      className="cursor-pointer hover:scale-105 transition-all duration-300"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white truncate flex-1 mr-2">
          {tool.name}
        </h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge className={getStatusColor()}>
            {tool.status === 'active' ? 'Ativa' : 
             tool.status === 'maintenance' ? 'Em Manutenção' : 
             tool.status === 'inactive' ? 'Inativa' : tool.status}
          </Badge>
          <button
            onClick={handleFavoriteClick}
            className={`p-1 rounded-full transition-colors ${
              tool.isFavorite 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-gray-400 hover:text-red-500'
            }`}
            aria-label={tool.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart className={`h-4 w-4 ${tool.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {tool.description && (
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {tool.description}
        </p>
      )}

      <div className="flex gap-2">
        <Button 
          variant="cyrus" 
          size="sm" 
          className="flex-1"
          onClick={handleCardClick}
        >
          Acessar
        </Button>
        
        {tool.access_url && (
          <Button 
            variant="cyrusOutline" 
            size="sm"
            onClick={handleExternalClick}
            rightIcon={<ExternalLink className="h-3 w-3" />}
          >
            Site
          </Button>
        )}
      </div>
    </Card>
  );
});

OptimizedToolCard.displayName = 'OptimizedToolCard';

export default OptimizedToolCard;
