
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Tool } from '@/shared/types/tool';

interface DeleteToolDialogProps {
  tool: Tool;
  onDelete: (toolId: number) => void;
  isDeleting?: boolean;
}

const DeleteToolDialog: React.FC<DeleteToolDialogProps> = ({
  tool,
  onDelete,
  isDeleting = false
}) => {
  const handleDelete = () => {
    onDelete(Number(tool.id));
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={isDeleting}
          className="min-w-[80px]"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {isDeleting ? 'Movendo...' : 'Lixeira'}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-orange-500" />
            Mover para Lixeira
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza que deseja mover a ferramenta{' '}
              <span className="font-semibold text-foreground">"{tool.name}"</span> para a lixeira?
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                💡 Não se preocupe!
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                A ferramenta será movida para a lixeira e poderá ser restaurada dentro de 30 dias. 
                Após 30 dias na lixeira, será excluída automaticamente. Você também terá 5 segundos para reverter esta ação imediatamente.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Mover para Lixeira
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteToolDialog;
