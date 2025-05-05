
import { Button } from '@/components/ui/button';
import SnakeGame from '@/components/SnakeGame';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '@/components/Web3Provider';
import { Trophy, Info } from 'lucide-react';

const Index = () => {
  const { connectWallet, isConnected, isConnecting, tokenBalance, address } = useWeb3();
  const navigate = useNavigate();
  
  const handleConnectWallet = () => {
    connectWallet();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-8 px-4">
      <header className="w-full max-w-3xl flex justify-between items-center mb-8 px-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-game-token">Snake <span className="text-white">Arcade</span></h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected && (
            <div className="hidden sm:block text-sm bg-gray-800 rounded-full px-3 py-1">
              <span className="text-gray-400">Balance:</span> <span className="text-game-token font-semibold">{tokenBalance} SKS</span>
            </div>
          )}
          
          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className={`text-sm ${isConnected ? 'bg-green-600' : 'bg-game-token'} hover:bg-opacity-90`}
            size="sm"
          >
            {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect'}
          </Button>
          
          {isConnected && (
            <Button
              onClick={() => navigate('/rewards')}
              className="text-sm bg-yellow-600 hover:bg-yellow-700"
              size="sm"
            >
              Rewards
            </Button>
          )}
        </div>
      </header>

      <main className="w-full max-w-3xl flex flex-col items-center justify-center px-4">
        <div className="w-full flex justify-center">
          <SnakeGame />
        </div>
        
        <div className="mt-6 flex gap-3 justify-center">
          <Button 
            onClick={() => navigate('/top-scores')} 
            variant="outline" 
            className="border-gray-700 text-white hover:bg-gray-800 flex items-center justify-center"
            size="sm"
          >
            <Trophy className="mr-2 h-4 w-4" /> Top Scores
          </Button>
          
          <Button 
            onClick={() => navigate('/about')} 
            variant="outline" 
            className="border-gray-700 text-white hover:bg-gray-800 flex items-center justify-center"
            size="sm"
          >
            <Info className="mr-2 h-4 w-4" /> About SKS
          </Button>
        </div>
      </main>

      <footer className="mt-12 text-center text-sm text-gray-500 pb-8">
        <p>Play Snake, watch ads, earn SKS tokens!</p>
        <p className="mt-2 text-xs">Built on Polygon Network</p>
      </footer>
    </div>
  );
};

export default Index;
