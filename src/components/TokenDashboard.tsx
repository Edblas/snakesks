import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameTokens } from '@/hooks/useGameTokens';
import { useWeb3 } from '@/components/Web3Provider';
import { Coins, TrendingUp, Play, Eye, Trophy, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TokenDashboard: React.FC = () => {
  const { address, isConnected } = useWeb3();
  const { 
    userProfile, 
    isLoading, 
    isWatchingAd, 
    watchRewardedVideo, 
    totalTokens, 
    totalScore, 
    gamesPlayed, 
    adsWatched 
  } = useGameTokens(address || 'anonymous');

  if (!isConnected) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <Coins className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-white mb-2">Conecte sua Carteira</h3>
          <p className="text-gray-400">
            Conecte sua carteira para ver seus tokens e estatísticas
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando seus dados...</p>
        </CardContent>
      </Card>
    );
  }

  const handleWatchAd = async () => {
    try {
      await watchRewardedVideo();
    } catch (error) {
      console.error('Erro ao assistir anúncio:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Token Balance Card */}
      <Card className="bg-gradient-to-r from-green-900 to-green-800 border-green-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Coins className="w-6 h-6 mr-2 text-green-400" />
            Seus Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-300 mb-2">
              🪙 {totalTokens.toLocaleString()}
            </div>
            <p className="text-green-200">Tokens Totais</p>
            
            <Button 
              onClick={handleWatchAd}
              disabled={isWatchingAd}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white"
            >
              {isWatchingAd ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Carregando Anúncio...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Assistir Anúncio (+50 tokens)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Games Played */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Play className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-white">{gamesPlayed}</div>
            <p className="text-gray-400 text-sm">Jogos Jogados</p>
          </CardContent>
        </Card>

        {/* Best Score */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-white">{totalScore.toLocaleString()}</div>
            <p className="text-gray-400 text-sm">Pontuação Total</p>
          </CardContent>
        </Card>

        {/* Ads Watched */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-white">{adsWatched}</div>
            <p className="text-gray-400 text-sm">Anúncios Assistidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {userProfile && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-white">Conta criada</span>
                </div>
                <Badge variant="secondary">
                  {new Date(userProfile.createdAt).toLocaleDateString()}
                </Badge>
              </div>
              
              {userProfile.lastGameAt && (
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    <span className="text-white">Último jogo</span>
                  </div>
                  <Badge variant="secondary">
                    {new Date(userProfile.lastGameAt).toLocaleDateString()}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Token Earning Tips */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Como Ganhar Mais Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-700 rounded-lg">
              <Play className="w-5 h-5 mr-3 text-blue-400" />
              <div>
                <p className="text-white font-medium">Jogue mais partidas</p>
                <p className="text-gray-400 text-sm">Ganhe tokens baseados na sua pontuação</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-700 rounded-lg">
              <Eye className="w-5 h-5 mr-3 text-purple-400" />
              <div>
                <p className="text-white font-medium">Assista anúncios</p>
                <p className="text-gray-400 text-sm">50 tokens por vídeo recompensado</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-700 rounded-lg">
              <Trophy className="w-5 h-5 mr-3 text-yellow-400" />
              <div>
                <p className="text-white font-medium">Faça pontuações altas</p>
                <p className="text-gray-400 text-sm">Mais pontos = mais tokens</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenDashboard;