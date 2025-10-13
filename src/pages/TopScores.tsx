
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/components/Web3Provider';
import { useFirebaseScores } from '@/hooks/useFirebaseScores';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Home, Gamepad2, Users, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScoresTable from '@/components/scores/ScoresTable';
import ScoresPagination from '@/components/scores/ScoresPagination';
import { NavigationHeader, QuickNavigation } from '@/components/ui/navigation';

function TopScores() {
  const navigate = useNavigate();
  const { isConnected } = useWeb3();
  const { scores, isLoading: loading, currentPage, totalPages, setCurrentPage } = useFirebaseScores();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <NavigationHeader 
        title="Top Scores"
        titleIcon={<Trophy className="w-6 h-6 mr-2" />}
        titleColor="text-yellow-400"
      />

      {/* Conteúdo principal */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center py-6">
            <h2 className="text-3xl font-bold mb-4">🏆 Ranking dos Melhores Jogadores</h2>
            <p className="text-xl text-gray-300">
              Veja quem está dominando o jogo da cobrinha e compete pelos primeiros lugares!
            </p>
          </div>
          {/* Tabela de Scores */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>🏅 Melhores Pontuações</span>
                {!isConnected && (
                  <span className="text-sm text-gray-400 font-normal">
                    Conecte sua carteira para ver seu ranking
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScoresTable 
                scores={scores} 
                isLoading={loading} 
                currentPage={currentPage}
                itemsPerPage={10}
                currentUserAddress={isConnected ? "user" : undefined}
              />
              
              {totalPages > 1 && (
                <div className="mt-6">
                  <ScoresPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center p-6">
                <div className="text-3xl mb-2">🎮</div>
                <h3 className="text-xl font-bold mb-2">Total de Jogadores</h3>
                <p className="text-2xl text-green-400 font-bold">
                  {scores?.length || 0}
                </p>
                <p className="text-sm text-gray-400">Jogadores ativos</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center p-6">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="text-xl font-bold mb-2">Melhor Score</h3>
                <p className="text-2xl text-yellow-400 font-bold">
                  {scores?.[0]?.score || 0}
                </p>
                <p className="text-sm text-gray-400">Pontuação máxima</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center p-6">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="text-xl font-bold mb-2">Média Geral</h3>
                <p className="text-2xl text-blue-400 font-bold">
                  {scores?.length ? Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length) : 0}
                </p>
                <p className="text-sm text-gray-400">Pontuação média</p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-green-800 to-blue-800 border-gray-700">
            <CardContent className="text-center p-8">
              <h3 className="text-2xl font-bold mb-4">🎯 Pronto para Competir?</h3>
              <p className="text-lg text-gray-200 mb-6">
                Entre no jogo e mostre suas habilidades! Alcance o topo do ranking.
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => navigate('/game')}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                  🎮 Jogar Agora
                </Button>
                <Button 
                  onClick={() => navigate('/about')}
                  size="lg"
                  variant="outline"
                  className="border-gray-400 text-gray-200 hover:bg-gray-700 hover:text-white px-8 py-3 transition-colors"
                >
                  ℹ️ Sobre o Jogo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer com navegação */}
          <QuickNavigation currentPage="top-scores" />
        </div>
      </main>

      <footer className="safe-area-bottom mt-auto text-center text-sm text-gray-500 pb-8">
        <p>Play Snake, watch ads, earn SKS tokens!</p>
        <p className="mt-2 text-xs">Built on Polygon Network</p>
      </footer>
    </div>
  );
}

export default TopScores;
