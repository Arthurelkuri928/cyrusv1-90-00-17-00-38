import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import PaymentForm from '@/components/checkout/PaymentForm';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const priceId = searchParams.get('priceId');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePayment = async () => {
      if (!priceId) {
        toast.error('ID do plano não fornecido');
        setLoading(false);
        return;
      }

      try {
        console.log('🚀 Iniciando processo de checkout para priceId:', priceId);

        // Passo 1: Criar o cliente Stripe
        console.log('📞 Chamando create-stripe-customer...');
        const { data: customerData, error: customerError } = await supabase.functions.invoke(
          'create-stripe-customer',
          {
            body: {}
          }
        );

        if (customerError) {
          console.error('❌ Erro ao criar cliente Stripe:', customerError);
          toast.error('Erro ao criar cliente');
          return;
        }

        const customerId = customerData?.customerId;
        console.log('✅ Cliente Stripe criado:', customerId);

        // Passo 2: Criar a subscription
        console.log('📞 Chamando create-subscription...');
        const { data: subscriptionData, error: subscriptionError } = await supabase.functions.invoke(
          'create-subscription',
          {
            body: {
              customerId,
              priceId
            }
          }
        );

        if (subscriptionError) {
          console.error('❌ Erro ao criar subscription:', subscriptionError);
          toast.error('Erro ao criar assinatura');
          return;
        }

        const clientSecret = subscriptionData?.clientSecret;
        console.log('✅ Subscription criada, clientSecret obtido');
        
        setClientSecret(clientSecret);
      } catch (error) {
        console.error('❌ Erro durante inicialização do checkout:', error);
        toast.error('Erro durante inicialização do checkout');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [priceId]);

  if (!priceId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Erro</h1>
          <p>ID do plano não fornecido na URL.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
          <p>Preparando seu checkout...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Erro</h1>
          <p>Não foi possível inicializar o pagamento. Tente novamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Finalizar Pagamento</h1>
        
        <Elements stripe={stripePromise}>
          <PaymentForm clientSecret={clientSecret} />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutPage;
