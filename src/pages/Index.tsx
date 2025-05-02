
import { Button } from '@/components/ui/button';
import SnakeGame from '@/components/SnakeGame';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();
  
  const handleConnectWallet = () => {
    // In a real implementation, this would connect to MetaMask or other wallet
    setConnected(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-8 px-4">
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-game-token">Snake <span className="text-white">Arcade</span></h1>
        </div>
        
        <Button
          onClick={handleConnectWallet}
          className={`text-sm ${connected ? 'bg-green-600' : 'bg-game-token'} hover:bg-opacity-90`}
        >
          {connected ? 'Wallet Connected' : 'Connect Wallet'}
        </Button>
      </header>

      <main className="w-full max-w-md">
        <SnakeGame />
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Play Snake, watch ads, earn SKS tokens!</p>
        <p className="mt-2 text-xs">Built on Polygon Network</p>
      </footer>
    </div>
  );
};

export default Index;
