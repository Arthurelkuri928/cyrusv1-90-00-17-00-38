import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionContainer from '@/components/shared/SectionContainer';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const PagamentoSucesso = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <SectionContainer spacing="lg" className="text-center">
        <div className="max-w-md mx-auto">
          {/* Ícone de sucesso */}
          <div className="mb-8 flex justify-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Pagamento Aprovado com Sucesso!
          </h1>

          {/* Mensagem de agradecimento */}
          <p className="text-lg text-foreground-muted mb-8 leading-relaxed">
            Obrigado por se juntar à Cyrus. Os seus dados de acesso e recibo foram enviados para o seu email.
          </p>

          {/* Botão principal */}
          <Link to={ROUTES.MEMBER_AREA}>
            <Button 
              variant="cyrusPrimary" 
              size="lg"
              className="w-full text-lg py-4 mb-4"
            >
              Aceder ao meu Dashboard
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

export default PagamentoSucesso;