import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-8xl mb-6">🐍</div>
        <h1 className="text-6xl font-bold mb-4 text-red-400">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
        <p className="text-gray-300 mb-8">
          Oops! A cobra não conseguiu encontrar esta página. 
          Parece que você se perdeu no labirinto!
        </p>
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800 px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
