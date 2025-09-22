import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionContainer from '@/components/shared/SectionContainer';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const PagamentoFalha = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <SectionContainer spacing="lg" className="text-center">
        <div className="max-w-md mx-auto">
          {/* Ícone de erro */}
          <div className="mb-8 flex justify-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-red-500 to-red-600">
              <XCircle className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ocorreu um Problema com o Pagamento
          </h1>

          {/* Mensagem explicativa */}
          <p className="text-lg text-foreground-muted mb-8 leading-relaxed">
            Infelizmente, não foi possível processar o seu pagamento. Por favor, verifique os dados do seu cartão ou tente com um método de pagamento diferente.
          </p>

          {/* Botão principal */}
          <Link to={ROUTES.PLANS}>
            <Button 
              variant="cyrusPrimary" 
              size="lg"
              className="w-full text-lg py-4 mb-4"
            >
              Tentar Novamente
            </Button>
          </Link>

          {/* Link secundário */}
          <Link to={ROUTES.HOME}>
            <Button 
              variant="ghost" 
              className="text-cyrus-primary hover:text-cyrus-light"
            >
              Voltar ao início
            </Button>
          </Link>
        </div>
      </SectionContainer>
    </div>
  );
};

export default PagamentoFalha;