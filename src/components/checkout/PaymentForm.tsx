import React, { useState } from 'react';
// // import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'; // Comentado
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaymentFormProps {
  clientSecret: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret }) => {
  // const stripe = useStripe(); // Comentado
  // const elements = useElements(); // Comentado
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Stripe desativado");
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'hsl(var(--foreground))',
        backgroundColor: 'hsl(var(--background))',
        fontFamily: 'system-ui, sans-serif',
        '::placeholder': {
          color: 'hsl(var(--muted-foreground))',
        },
      },
      invalid: {
        color: 'hsl(var(--destructive))',
        iconColor: 'hsl(var(--destructive))',
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stripe Card Element */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Informações do Cartão
          </label>
          <div className="p-4 border border-input rounded-md bg-background">
            {/* <CardElement options={cardElementOptions} /> */}
          </div>
        </div>

        {/* Feedback Message */}
        {message && (
          <div
            className={cn(
              "p-3 rounded-md text-sm",
              messageType === 'error' && "bg-destructive/10 text-destructive border border-destructive/20",
              messageType === 'success' && "bg-green-50 text-green-800 border border-green-200"
            )}
          >
            {message}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={true} // Desabilitado para fins de teste
          className="w-full"
        >
          {isProcessing ? 'Processando...' : 'Pagar Assinatura'}
        </Button>
      </form>

      {/* Note: Este componente deve ser envolvido por um Elements provider da Stripe */}
      {/* Removido o aviso, pois a funcionalidade está desativada */}
    </div>
  );
};

export default PaymentForm;
