import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, Info, Trophy, Gift, ArrowLeft } from 'lucide-react';
import GameCanvas from '@/components/snake/GameCanvas';

export default function Game() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleGoToInfo = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Header de navegação - fixo no topo */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 safe-area-top">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Navegação esquerda */}
            <div className="flex space-x-2">
              <Button 
                onClick={handleBackToHome}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <Home className="w-4 h-4 mr-1" />
                Início
              </Button>
            </div>

            {/* Score central */}
            <div className="text-center">
              <span className="text-sm text-gray-400">Score: </span>
              <span className="text-lg font-bold text-green-400">{score}</span>
            </div>

            {/* Navegação direita */}
            <div className="flex space-x-2">
              <Button 
                onClick={() => navigate('/top-scores')}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <Trophy className="w-4 h-4 mr-1" />
                Ranking
              </Button>
              <Button 
                onClick={() => navigate('/rewards')}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <Gift className="w-4 h-4 mr-1" />
                Recompensas
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo do jogo */}
      <main className="pt-16">
        <GameCanvas onScoreUpdate={setScore} />
      </main>
    </div>
  );
}