import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';
import { PageVisibility } from '@/app/store/pageVisibility.store';
import Loader from '@/components/ui/loader';

interface PageVisibilityTableProps {
  pages: PageVisibility[];
  updatingPages: Set<string>;
  canEditPages: boolean;
  onToggleVisibility: (pageId: string, currentVisibility: boolean) => void;
}

const PageVisibilityTable = ({ 
  pages, 
  updatingPages, 
  canEditPages, 
  onToggleVisibility 
}: PageVisibilityTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome da Página</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Última Atualização</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => {
            const isUpdating = updatingPages.has(page.id);
            return (
              <TableRow 
                key={page.id} 
                className={`${isUpdating ? 'opacity-70' : ''} ${
                  page.is_visible ? 'bg-green-50/30 dark:bg-green-950/20' : 'bg-red-50/30 dark:bg-red-950/20'
                }`}
              >
                <TableCell className="font-medium">{page.name}</TableCell>
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-xs">{page.slug}</code>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
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
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(page.updated_at).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={page.is_visible}
                    onCheckedChange={() => onToggleVisibility(page.id, page.is_visible)}
                    disabled={!canEditPages || isUpdating}
                    className="data-[state=checked]:bg-green-500"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PageVisibilityTable;