
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/components/Web3Provider';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Home, Gamepad2, Wallet, Trophy, Coins, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RewardsTable from '@/components/rewards/RewardsTable';
import CurrentPeriod from '@/components/rewards/CurrentPeriod';
import WithdrawalSystem from '@/components/WithdrawalSystem';
import { NavigationHeader, QuickNavigation } from '@/components/ui/navigation';

export default function Rewards() {
  const navigate = useNavigate();
  const { isConnected, connectWallet } = useWeb3();
  const [showWithdrawalInfo, setShowWithdrawalInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <NavigationHeader 
        title="Recompensas"
        titleIcon={<Gift className="w-6 h-6 mr-2" />}
        titleColor="text-purple-400"
      />

      {/* Conteúdo principal */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center py-6">
            <h2 className="text-3xl font-bold mb-4">🎁 Sistema de Recompensas</h2>
            <p className="text-xl text-gray-300">
              Ganhe tokens jogando e assistindo anúncios. Quanto melhor você joga, mais você ganha!
            </p>
          </div>
      
          {/* Status da Conexão */}
          {!isConnected ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center p-8">
                <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-bold mb-4">Conecte sua Carteira</h3>
                <p className="text-gray-300 mb-6">
                  Para ver suas recompensas e sacar tokens, você precisa conectar uma carteira Web3.
                </p>
                <Button 
                  onClick={connectWallet}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Conectar Carteira
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Período Atual */}
              <CurrentPeriod />

              {/* Tabela de Recompensas */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Histórico de Recompensas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="mb-2 text-gray-300">Nenhuma recompensa ainda!</p>
                    <p className="text-sm text-gray-400">
                      Jogue Snake e fique entre os melhores do ranking mensal para ganhar tokens SKS.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sistema de Saque */}
              <WithdrawalSystem />
            </>
          )}

          {/* Como Ganhar Recompensas */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-400">💡 Como Ganhar Recompensas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <div className="text-3xl mb-3">🎮</div>
                  <h4 className="font-semibold mb-2">Jogue Snake</h4>
                  <p className="text-sm text-gray-300">
                    Ganhe tokens baseado na sua pontuação. Quanto maior o score, maior a recompensa!
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <div className="text-3xl mb-3">📺</div>
                  <h4 className="font-semibold mb-2">Assista Anúncios</h4>
                  <p className="text-sm text-gray-300">
                    Veja anúncios opcionais após os jogos para ganhar tokens extras.
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <div className="text-3xl mb-3">🏆</div>
                  <h4 className="font-semibold mb-2">Seja Consistente</h4>
                  <p className="text-sm text-gray-300">
                    Jogue regularmente para maximizar suas recompensas mensais.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-purple-800 to-pink-800 border-purple-600">
            <CardContent className="text-center p-8">
              <h3 className="text-2xl font-bold mb-4">🚀 Comece a Ganhar Agora!</h3>
              <p className="text-lg text-gray-200 mb-6">
                Entre no jogo e comece a acumular recompensas hoje mesmo!
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
                  onClick={() => navigate('/top-scores')}
                  size="lg"
                  variant="outline"
                  className="border-gray-400 text-gray-200 hover:bg-gray-700 hover:text-white px-8 py-3 transition-colors"
                >
                  🏆 Ver Rankings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer com navegação */}
          <QuickNavigation currentPage="rewards" />
        </div>
      </main>
    </div>
  );
}
