
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Gamepad2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NavigationHeader, QuickNavigation } from '@/components/ui/navigation';

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <NavigationHeader 
        title="Sobre o Snake Game"
        titleIcon={<span className="mr-2">ℹ️</span>}
        titleColor="text-green-400"
      />

      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="space-y-8">
          {/* Introdução */}
          <div className="text-center py-6">
            <h2 className="text-3xl font-bold mb-4">🐍 Snake Game Web3</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Jogue Snake e ganhe tokens SKS na rede Polygon.
            </p>
          </div>
          {/* Cards informativos */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  🎮 Como Jogar
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3">
                <p>
                  Use as setas do teclado ou toque na tela para controlar a cobra.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Colete comida para crescer e ganhar pontos</li>
                  <li>Evite bater nas paredes ou no próprio corpo</li>
                  <li>Ganhe tokens SKS baseado na sua pontuação</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  🔗 Token SKS
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3">
                <p>
                  Conecte sua carteira e ganhe tokens SKS jogando.
                </p>
                <div className="bg-gray-700 p-3 rounded-lg text-sm">
                  <p><strong>Contrato:</strong> 0x4507172aD2bc977FeC89C3Cff5Fa16B79856a433</p>
                  <p><strong>Supply Total:</strong> 100.000.000 SKS</p>
                  <p><strong>Rede:</strong> Polygon</p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Tokens baseados na pontuação</li>
                  <li>Limite diário de jogos</li>
                  <li>Parte dos tokens direcionados ao game</li>
                  <li>75% do lucro vai para pool de liquidez</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-purple-400">🎁 Como Ganhar Tokens</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">🏆</div>
                  <h4 className="font-semibold mb-2">Jogue e Pontue</h4>
                  <p className="text-sm">
                    Ganhe tokens baseado na sua pontuação no jogo.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">📺</div>
                  <h4 className="font-semibold mb-2">Assista Anúncios</h4>
                  <p className="text-sm">
                    Assista anúncios opcionais para ganhar tokens extras.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comunidade Discord */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-indigo-400 flex items-center">
                💬 Comunidade
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 text-center">
              <p className="mb-4">
                Junte-se à nossa comunidade no Discord para dicas, atualizações e suporte!
              </p>
              <Button 
                onClick={() => window.open('https://discord.gg/ZvTQJS4H', '_blank')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                🎮 Entrar no Discord
              </Button>
            </CardContent>
          </Card>

          {/* Footer com navegação */}
          <QuickNavigation currentPage="about" />
        </div>
      </main>

      <footer className="safe-area-bottom mt-auto text-center text-sm text-gray-500 pb-8">
        <p>© 2025 Snake Krypto System. All rights reserved.</p>
        <p className="mt-2 text-xs">Built on Polygon Network</p>
      </footer>
    </div>
  );
};

export default About;
