import React from 'react';
import { Edit, Trash2, Eye, EyeOff, Settings, Power, Wrench } from 'lucide-react';
import { UnifiedButton } from '../../atoms/UnifiedButton/UnifiedButton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface AdminActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onMaintenance?: () => void;
  onSettings?: () => void;
  isVisible?: boolean;
  isActive?: boolean;
  isMaintenance?: boolean;
  isLoading?: boolean;  
  canEdit?: boolean;
  canDelete?: boolean;
  canToggleStatus?: boolean;
  className?: string;
}

const AdminActionButtons = React.forwardRef<HTMLDivElement, AdminActionButtonsProps>(
  ({ 
    onEdit,
    onDelete,
    onToggleVisibility,
    onActivate,
    onDeactivate,
    onMaintenance,
    onSettings,
    isVisible = true,
    isActive = false,
    isMaintenance = false,
    isLoading = false,
    canEdit = true,
    canDelete = true,
    canToggleStatus = true,
    className
  }, ref) => {
    return (
      <TooltipProvider>
        <div ref={ref} className={`flex items-center gap-2 ${className}`}>
          {/* Status Control Buttons */}
          {canToggleStatus && (
            <>
              {onActivate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <UnifiedButton
                      variant="success"
                      size="sm"
                      onClick={onActivate}
                      disabled={isLoading || (isActive && !isMaintenance)}
                    >
                      <Power className="h-4 w-4" />
                      {isLoading ? 'Atualizando...' : 'Ativar'}
                    </UnifiedButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ativar item</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {onDeactivate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <UnifiedButton
                      variant="secondary"
                      size="sm"
                      onClick={onDeactivate}
                      disabled={isLoading || (!isActive && !isMaintenance)}
                    >
                      <EyeOff className="h-4 w-4" />
                      {isLoading ? 'Atualizando...' : 'Desativar'}
                    </UnifiedButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Desativar item</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {onMaintenance && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <UnifiedButton
                      variant="warning"
                      size="sm"
                      onClick={onMaintenance}
                      disabled={isLoading || isMaintenance}
                    >
                      <Wrench className="h-4 w-4" />
                      {isLoading ? 'Atualizando...' : 'Manutenção'}
                    </UnifiedButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Colocar em manutenção</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </>
          )}

          {/* Visibility Toggle */}
          {onToggleVisibility && (
            <Tooltip>
              <TooltipTrigger asChild>
                <UnifiedButton
                  variant="outline"
                  size="sm"
                  onClick={onToggleVisibility}
                  disabled={isLoading}
                >
                  {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </UnifiedButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isVisible ? 'Ocultar' : 'Mostrar'}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Edit Button */}
          {canEdit && onEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <UnifiedButton
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4" />
                </UnifiedButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Settings Button */}
          {onSettings && (
            <Tooltip>
              <TooltipTrigger asChild>
                <UnifiedButton
                  variant="outline"
                  size="sm"
                  onClick={onSettings}
                  disabled={isLoading}
                >
                  <Settings className="h-4 w-4" />
                </UnifiedButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configurações</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Delete Button */}
          {canDelete && onDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <UnifiedButton
                  variant="destructive"
                  size="sm"
                  onClick={onDelete}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </UnifiedButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Excluir</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    );
  }
);
AdminActionButtons.displayName = 'AdminActionButtons';

export { AdminActionButtons };