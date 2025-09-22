
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { CreditCard, Download, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Invoice {
  id_transacao: string;
  valor_pago: number;
  moeda: string;
  data_pagamento: string;
  status_pagamento: string;
}

interface InvoiceHistoryCardProps {
  invoices: Invoice[];
  historyLoading: boolean;
  isDownloading: boolean;
  onDownloadInvoice: (transactionId: string) => Promise<void>;
  onDebugInvoices: () => Promise<void>;
}

const InvoiceHistoryCard = ({ 
  invoices, 
  historyLoading, 
  isDownloading, 
  onDownloadInvoice, 
  onDebugInvoices 
}: InvoiceHistoryCardProps) => {
  const { t } = useLanguage();

  const formatInvoiceForDisplay = (invoice: Invoice) => {
    const date = new Date(invoice.data_pagamento);
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const formattedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: invoice.moeda
    }).format(invoice.valor_pago);

    const statusLabels: { [key: string]: string } = {
      'pago': t('paid'),
      'pendente': 'Pendente',
      'falha': 'Falha'
    };

    return {
      date: formattedDate,
      amount: formattedAmount,
      status: statusLabels[invoice.status_pagamento] || invoice.status_pagamento,
      transactionId: invoice.id_transacao
    };
  };

  return (
    <UnifiedCard
      variant="subscription"
      title={t('invoiceHistory')}
      headerAction={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDebugInvoices}
            className="text-xs"
          >
            Debug
          </Button>
          <CreditCard className="h-5 w-5 text-[#A855F7]" />
        </div>
      }
      className="col-span-1 lg:col-span-2"
    >
      {historyLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="ml-2 text-sm">Carregando histórico...</span>
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nenhuma fatura encontrada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {invoices.map((invoice, index) => {
            const displayInvoice = formatInvoiceForDisplay(invoice);
            return (
              <div key={index} className="bg-muted/50 rounded-lg p-3 border border-border hover:bg-muted/70 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-[#A855F7]/20 p-2 rounded-md flex-shrink-0">
                      <CreditCard className="h-3 w-3 text-[#A855F7]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-foreground font-semibold text-sm">{displayInvoice.amount}</p>
                        <Badge className={`text-xs px-2 py-0.5 ${
                          invoice.status_pagamento === 'pago' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : invoice.status_pagamento === 'pendente'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {displayInvoice.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{displayInvoice.date}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[#A855F7] hover:bg-[#A855F7]/10 transition-all duration-200 px-2 py-1 text-xs ml-2"
                    onClick={() => onDownloadInvoice(displayInvoice.transactionId)}
                    disabled={isDownloading || invoice.status_pagamento !== 'pago'}
                    title={invoice.status_pagamento !== 'pago' ? 'Disponível apenas para faturas pagas' : 'Baixar fatura em PDF'}
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Download className="h-3 w-3 mr-1" />
                        {t('download')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </UnifiedCard>
  );
};

export default InvoiceHistoryCard;
