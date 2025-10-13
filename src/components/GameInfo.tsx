import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdSystem } from '@/components/AdSystem';
import { Web3Provider, useWeb3 } from '@/components/Web3Provider';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Trophy, 
  Coins, 
  Zap, 
  Shield, 
  Target,
  Gamepad2,
  Wallet,
  Gift,
  Star,
  TrendingUp,
  Users,
  Award,
  Clock,
  Sparkles
} from 'lucide-react';
import { NavigationHeader, QuickNavigation } from '@/components/ui/navigation';

// Componentes Web3 simplificados
const Web3WalletConnect = () => (
  <div className="space-y-4">
    <Button className="w-full bg-blue-600 hover:bg-blue-700">
      Conectar MetaMask
    </Button>
    <p className="text-sm text-gray-400">
      Status: Desconectado
    </p>
  </div>
);

const Web3NFTCollection = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-2">
      <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-2xl">🐍</span>
      </div>
      <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-2xl">🏆</span>
      </div>
    </div>
    <p className="text-sm text-gray-400">
      0/10 NFTs desbloqueados
    </p>
  </div>
);

const Web3TokenRewards = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <span className="text-white">Tokens Ganhos:</span>
      <Badge variant="secondary">0 SNAKE</Badge>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-white">Próxima Recompensa:</span>
      <span className="text-gray-400">100 pontos</span>
    </div>
    <Button className="w-full" variant="outline" disabled>
      Resgatar Tokens
    </Button>
  </div>
);

const GameInfo: React.FC = () => {
  const navigate = useNavigate();
  const [showAdModal, setShowAdModal] = useState(false);
  const [gameEndScore, setGameEndScore] = useState(0);

  const handlePlayGame = () => {
    navigate('/game');
  };

  const handleShowAd = () => {
    setShowAdModal(true);
    setGameEndScore(100); // Exemplo de score
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header com navegação */}
      <header className="safe-area-top bg-gray-800/50 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-green-400">🐍 Snake Game</h1>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-6xl mx-auto p-4">
        {/* Hero Section */}
        <div className="text-center py-8 mb-8">
          <h2 className="text-4xl font-bold mb-4">Bem-vindo ao Snake Game!</h2>
          <p className="text-xl text-gray-300 mb-6">
            Jogue o clássico jogo da cobrinha e ganhe recompensas
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handlePlayGame}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              🎮 Começar a Jogar
            </Button>
            <Button 
              onClick={() => navigate('/top-scores')}
              size="lg"
              variant="outline"
              className="border-gray-400 text-black hover:bg-gray-700 hover:text-white px-8 py-3 text-lg transition-colors"
            >
              🏆 Ver Ranking
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-800 mb-6 gap-1 relative z-30 h-auto">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-green-600 text-xs md:text-sm px-2 py-3 relative z-30">
              📋 Visão Geral
            </TabsTrigger>
            <TabsTrigger value="web3" className="text-white data-[state=active]:bg-blue-600 text-xs md:text-sm px-2 py-3 relative z-30">
              🔗 Web3
            </TabsTrigger>
            <TabsTrigger value="rewards" className="text-white data-[state=active]:bg-purple-600 text-xs md:text-sm px-2 py-3 relative z-30">
              🎁 Recompensas
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-white data-[state=active]:bg-red-600 text-xs md:text-sm px-2 py-3 relative z-30">
              📊 Estatísticas
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    🎮 Como Jogar
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <ul className="space-y-2">
                    <li>• Use as setas para mover a cobra</li>
                    <li>• Colete comida para crescer</li>
                    <li>• Evite bater nas paredes</li>
                    <li>• Ganhe tokens SKS jogando</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center">
                    🏆 Pontuação
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Cada comida:</span>
                      <span className="text-green-400">10 pontos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bônus velocidade:</span>
                      <span className="text-blue-400">+5 pontos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">🎮 Controles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Desktop:</h4>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>Mover:</span>
                        <Badge variant="outline">↑ ↓ ← → ou WASD</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Pausar:</span>
                        <Badge variant="outline">ESPAÇO</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-3">Mobile:</h4>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>Mover:</span>
                        <Badge variant="outline">Toque na tela</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Pausar:</span>
                        <Badge variant="outline">Botão pausar</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Web3 Tab */}
          <TabsContent value="web3" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">🔗 Carteira Web3</CardTitle>
              </CardHeader>
              <CardContent>
                <Web3WalletConnect />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">🎨 NFTs</CardTitle>
                </CardHeader>
                <CardContent>
                  <Web3NFTCollection />
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">💎 Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                  <Web3TokenRewards />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-yellow-400 text-lg">🥉 Bronze</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 text-sm">
                  <div className="space-y-1">
                    <p>Score: 50-99</p>
                    <p>10 tokens</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-400/20 to-gray-600/20 border-gray-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-gray-300 text-lg">🥈 Prata</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 text-sm">
                  <div className="space-y-1">
                    <p>Score: 100-199</p>
                    <p>25 tokens</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-yellow-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-yellow-400 text-lg">🥇 Ouro</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 text-sm">
                  <div className="space-y-1">
                    <p>Score: 200+</p>
                    <p>50 tokens</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">🎯 Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">🐍</Badge>
                    <span className="text-gray-300 text-sm">Primeira Comida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600">🏃</Badge>
                    <span className="text-gray-300 text-sm">Velocista</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600">🎯</Badge>
                    <span className="text-gray-300 text-sm">Atirador</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-600">🔥</Badge>
                    <span className="text-gray-300 text-sm">Em Chamas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="bg-gray-800/50 border-gray-700 text-center">
                <CardContent className="pt-4 pb-4">
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-gray-400 text-sm">Jogos</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 text-center">
                <CardContent className="pt-4 pb-4">
                  <div className="text-2xl font-bold text-yellow-400">0</div>
                  <div className="text-gray-400 text-sm">Melhor Score</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 text-center">
                <CardContent className="pt-4 pb-4">
                  <div className="text-2xl font-bold text-blue-400">0</div>
                  <div className="text-gray-400 text-sm">Tokens</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 text-center">
                <CardContent className="pt-4 pb-4">
                  <div className="text-2xl font-bold text-purple-400">0</div>
                  <div className="text-gray-400 text-sm">NFTs</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">📊 Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-400 py-6">
                  <p>Nenhum jogo jogado ainda.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer com navegação rápida */}
        <QuickNavigation currentPage="home" />
      </main>
    </div>
  );
};

export default GameInfo;