
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';
import { PageVisibility } from '@/app/store/pageVisibility.store';
import Loader from '@/components/ui/loader';

interface PageVisibilityCompactProps {
  pages: PageVisibility[];
  updatingPages: Set<string>;
  canEditPages: boolean;
  onToggleVisibility: (pageId: string, currentVisibility: boolean) => void;
}

const PageVisibilityCompact = ({ 
  pages, 
  updatingPages, 
  canEditPages, 
  onToggleVisibility 
}: PageVisibilityCompactProps) => {
  return (
    <div className="space-y-2">
      {pages.map((page) => {
        const isUpdating = updatingPages.has(page.id);
        return (
          <div 
            key={page.id} 
            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
              page.is_visible 
                ? 'border-green-200 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20' 
                : 'border-red-200 bg-red-50/50 dark:border-red-800/50 dark:bg-red-950/20'
            } ${isUpdating ? 'opacity-70' : ''}`}
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium">{page.name}</div>
                <div className="text-xs text-muted-foreground">
                  <code className="bg-muted px-1 rounded">{page.slug}</code>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={page.is_visible ? "default" : "secondary"} className="text-xs">
                  {page.is_visible ? (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Visível
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Oculta
                    </>
                  )}
                </Badge>
                {isUpdating && (
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-xs">
                    <Loader variant="spinner" size="sm" className="mr-1" />
                    Atualizando...
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right text-xs text-muted-foreground">
                {new Date(page.updated_at).toLocaleString('pt-BR')}
              </div>
              <Switch
                checked={page.is_visible}
                onCheckedChange={() => onToggleVisibility(page.id, page.is_visible)}
                disabled={!canEditPages || isUpdating}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PageVisibilityCompact;
