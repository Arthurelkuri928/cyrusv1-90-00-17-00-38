
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';
import { PageVisibility } from '@/app/store/pageVisibility.store';
import Loader from '@/components/ui/loader';

interface PageVisibilityCardsProps {
  pages: PageVisibility[];
  updatingPages: Set<string>;
  canEditPages: boolean;
  onToggleVisibility: (pageId: string, currentVisibility: boolean) => void;
}

const PageVisibilityCards = ({ 
  pages, 
  updatingPages, 
  canEditPages, 
  onToggleVisibility 
}: PageVisibilityCardsProps) => {
  return (
    <div className="grid gap-4">
      {pages.map((page) => {
        const isUpdating = updatingPages.has(page.id);
        return (
          <Card 
            key={page.id} 
            className={`transition-all ${
              page.is_visible 
                ? 'border-green-200 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20' 
                : 'border-red-200 bg-red-50/50 dark:border-red-800/50 dark:bg-red-950/20'
            } ${isUpdating ? 'opacity-70' : ''}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{page.name}</h3>
                    <Badge variant={page.is_visible ? "default" : "secondary"}>
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
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950">
                        <Loader variant="spinner" size="sm" className="mr-1" />
                        Atualizando...
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ID: <code className="bg-muted px-1 rounded">{page.id}</code>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Slug: <code className="bg-muted px-1 rounded">{page.slug}</code>
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {page.is_visible ? 'Ativa para usuários' : 'Oculta para usuários'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Atualizada: {new Date(page.updated_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  
                  <Switch
                    checked={page.is_visible}
                    onCheckedChange={() => onToggleVisibility(page.id, page.is_visible)}
                    disabled={!canEditPages || isUpdating}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PageVisibilityCards;
