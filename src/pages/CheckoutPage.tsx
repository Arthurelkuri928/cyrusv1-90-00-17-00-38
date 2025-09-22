import { useSearchParams } from 'react-router-dom';

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const priceId = searchParams.get('priceId');

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', color: 'black', backgroundColor: 'white', height: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>PÁGINA DE TESTE - UTA 1 OK</h1>
      <p style={{ marginTop: '20px' }}>O componente CheckoutPage foi renderizado com sucesso.</p>
      {priceId ? (
        <p style={{ marginTop: '10px' }}>
          O ID do Plano recebido da URL é: <strong style={{ color: 'green' }}>{priceId}</strong>
        </p>
      ) : (
        <p style={{ marginTop: '10px', color: 'red' }}>
          Nenhum ID de Plano foi recebido na URL.
        </p>
      )}
    </div>
  );
};

export default CheckoutPage;
