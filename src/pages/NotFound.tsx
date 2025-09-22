
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111] px-4 text-center">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 19H22L12 2Z" fill="#E91E63" />
      </svg>
      <h1 className="text-6xl font-bold text-white mt-8">404</h1>
      <p className="text-xl text-gray-400 mt-4 mb-8">Oops! Página não encontrada</p>
      <p className="text-gray-500 max-w-md mb-8">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Button asChild className="bg-primary hover:bg-primary/80 text-white font-bold">
        <Link to="/">Voltar ao Início</Link>
      </Button>
    </div>
  );
};

export default NotFound;
