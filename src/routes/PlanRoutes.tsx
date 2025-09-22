
import { Routes, Route } from 'react-router-dom';
import PlanoEspecificoPage from '@/pages/PlanoEspecificoPage';

const PlanRoutes = () => {
  return (
    <Routes>
      <Route path="/plano/:tipo" element={<PlanoEspecificoPage />} />
    </Routes>
  );
};

export default PlanRoutes;
