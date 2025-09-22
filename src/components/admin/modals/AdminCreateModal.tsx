import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import { useAdminDashboard } from '../../../contexts/AdminDashboardContext';
import { Button } from "@/components/ui/button";

export const AdminCreateModal: React.FC = () => {
  const { isCreateModalOpen, setCreateModalOpen } = useAdminDashboard();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'diagnostic'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating admin document:', formData);
    setCreateModalOpen(false);
    setFormData({ title: '', content: '', type: 'diagnostic' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isCreateModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCreateModalOpen(false)}
          className="absolute inset-0 bg-modal-overlay backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-modal-bg rounded-lg border border-border shadow-xl"
        >
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Criar Novo Documento
                </h2>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1 hover:bg-accent rounded-md transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Título do Documento
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Digite o título..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tipo de Documento
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="diagnostic">Diagnóstico</option>
                  <option value="user_report">Relatório de Usuários</option>
                  <option value="tool_analysis">Análise de Ferramentas</option>
                  <option value="notification">Notificação</option>
                  <option value="permission">Configuração de Permissão</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Conteúdo
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Digite o conteúdo do documento..."
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCreateModalOpen(false)}
                  className="text-nav-item hover:text-foreground"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  Criar Documento
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};