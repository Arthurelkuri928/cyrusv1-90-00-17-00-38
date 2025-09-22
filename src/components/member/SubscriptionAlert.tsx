
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Clock } from 'lucide-react';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SubscriptionAlert = () => {
  const { subscriptionStatus, isSubscriptionValid, expiresAt } = useSubscriptionStatus();

  if (!subscriptionStatus || isSubscriptionValid) {
    return null;
  }

  // Se assinatura expirou
  if (subscriptionStatus.status === 'expired') {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Assinatura Expirada</AlertTitle>
        <AlertDescription>
          Sua assinatura expirou em {expiresAt ? format(new Date(expiresAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'data desconhecida'}.
          Entre em contato com o suporte para renovar seu acesso.
        </AlertDescription>
      </Alert>
    );
  }

  // Se assinatura está suspensa
  if (subscriptionStatus.status === 'suspended') {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Conta Suspensa</AlertTitle>
        <AlertDescription>
          Sua conta está temporariamente suspensa. Entre em contato com o suporte para mais informações.
        </AlertDescription>
      </Alert>
    );
  }

  // Alertas para assinaturas que vão expirar em breve
  if (expiresAt) {
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    const diffInDays = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 7 && diffInDays > 0) {
      return (
        <Alert variant="destructive" className="mb-6">
          <Clock className="h-4 w-4" />
          <AlertTitle>Assinatura Expirando</AlertTitle>
          <AlertDescription>
            Sua assinatura expira em {diffInDays} dia(s) - {format(expirationDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}.
            Renove sua assinatura para manter o acesso.
          </AlertDescription>
        </Alert>
      );
    }
  }

  return null;
};

export default SubscriptionAlert;
