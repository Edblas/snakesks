
import { Button } from '@/components/ui/button';
import SnakeGame from '@/components/SnakeGame';
import WalletRegistration from '@/components/WalletRegistration';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '@/components/Web3Provider';
import { usePlayerRegistration } from '@/hooks/usePlayerRegistration';
import { Trophy, Info, Users, Coins } from 'lucide-react';

const Index = () => {
  const { connectWallet, isConnected, isConnecting, tokenBalance, address } = useWeb3();
  const { 
    playerData, 
    isRegistered, 
    registerPlayer, 
    getPlayerStats,
    updateAfterGame
  } = usePlayerRegistration();
  const navigate = useNavigate();
  
  const handleConnectWallet = () => {
    connectWallet();
  };

  const handleRegisterWallet = (walletAddress: string) => {
    registerPlayer(walletAddress);
  };

  const playerStats = getPlayerStats();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-4 py-6">
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-game-token">Snake <span className="text-white">SKS</span></h1>
          <div className="ml-6 flex items-center space-x-4 text-sm">
            <a 
              href="https://discord.gg/ZR7XrTr5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Users size={16} className="mr-1" />
              Discord
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {playerStats && (
            <div className="hidden sm:flex items-center space-x-3 text-sm">
              <div className="bg-gray-800 rounded-full px-4 py-2 border border-gray-700">
                <span className="text-gray-300">SKS:</span> 
                <span className="text-game-token font-semibold ml-1">{playerStats.tokensEarned}</span>
              </div>
              <div className="bg-gray-800 rounded-full px-4 py-2 border border-gray-700">
                <span className="text-gray-300">Rank:</span> 
                <span className="text-yellow-400 font-semibold ml-1">{playerStats.rank}</span>
              </div>
            </div>
          )}
          
          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className={`text-sm px-4 py-2 ${isConnected ? 'bg-green-600 hover:bg-green-700' : 'bg-game-token hover:bg-opacity-90'} transition-colors`}
            size="sm"
          >
            {isConnecting ? 'Conectando...' : isConnected ? 'Conectado' : 'Conectar'}
          </Button>
          
          <Button
            onClick={() => navigate('/top-scores')}
            className="text-sm bg-yellow-600 hover:bg-yellow-700 px-4 py-2 transition-colors text-black"
            size="sm"
          >
            <Trophy size={16} className="mr-1" />
            Ranking
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
        {!isRegistered ? (
          <div className="w-full max-w-md mb-8">
            <WalletRegistration
              onRegister={handleRegisterWallet}
              isRegistered={isRegistered}
              currentAddress={playerData?.address}
            />
          </div>
        ) : (
          <>
            {playerStats && (
              <div className="w-full max-w-md mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-game-token mb-1">{playerStats.tokensEarned}</div>
                    <div className="text-gray-300">SKS Tokens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-1">{playerStats.gamesPlayed}</div>
                    <div className="text-gray-300">Jogos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{playerStats.rank}</div>
                    <div className="text-gray-300">Rank</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">{playerStats.dailyGamesLeft}</div>
                    <div className="text-gray-300">Restantes</div>
                  </div>
                </div>
                
                {!playerStats.canEarnTokens && (
                  <div className="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded text-yellow-200 text-sm text-center">
                    Limite diário atingido. Volte amanhã para ganhar mais tokens!
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 shadow-xl relative">
              <SnakeGame onScoreUpdate={updateAfterGame} />
            </div>
          </>
        )}
        
        <div className="mt-8 flex gap-4 justify-center">
          <Button
            onClick={() => navigate('/about')}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800 hover:text-white transition-colors px-6 py-3"
          >
            <Info className="mr-2" size={16} />
            Sobre
          </Button>
          
          <Button
            onClick={() => navigate('/top-scores')}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800 hover:text-white transition-colors px-6 py-3"
          >
            <Trophy className="mr-2" size={16} />
            Rankings
          </Button>
        </div>
      </main>

      <footer className="safe-area-bottom mt-8 text-center text-sm text-gray-400 pb-6">
        <p className="mb-2">🐍 Jogue Snake, ganhe tokens SKS na rede Polygon!</p>
        <p className="text-xs text-gray-500">
          Skillswap Token (SKS) • 
          <a 
            href="https://discord.gg/ZR7XrTr5" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 ml-1 transition-colors"
          >
            Discord
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
