
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useWeb3 } from '@/components/Web3Provider';

const Reward = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isConnected } = useWeb3();
  const [adWatched, setAdWatched] = useState(false);
  const [tokensClaimed, setTokensClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(15); 
  const [isAdVisible, setIsAdVisible] = useState(true);
  
  // Simulate ad loading and watching with mandatory viewing
  useEffect(() => {
    if (isAdVisible && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    if (isAdVisible && countdown === 0) {
      setAdWatched(true);
      toast({
        title: "Ad completed!",
        description: "You can now claim your SKS tokens.",
      });
    }
  }, [isAdVisible, countdown, toast]);

  const handleClaimTokens = () => {
    if (!adWatched) {
      toast({
        title: "Ad not completed",
        description: "You must watch the entire ad before claiming tokens.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate token claim process
    setTimeout(() => {
      setTokensClaimed(true);
      setIsLoading(false);
      toast({
        title: "Tokens claimed!",
        description: "5 SKS tokens have been sent to your wallet.",
      });
    }, 2000);
  };

  const playAgain = () => {
    navigate('/');
  };

  // Removed skipAd function since ad viewing is now mandatory

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Earn SKS Tokens</h1>
        
        {isAdVisible && (
          <div className="mb-8 bg-gray-800 rounded-lg p-4 text-center">
            <div className="animate-pulse mb-4 h-40 bg-gray-700 rounded flex items-center justify-center">
              {!adWatched ? (
                <p className="text-xl">Ad playing... {countdown}s</p>
              ) : (
                <p className="text-xl">Ad completed!</p>
              )}
            </div>
            <p className="text-sm text-gray-400">
              {!adWatched 
                ? "Please wait until the ad is complete to earn tokens." 
                : "Thanks for watching!"}
            </p>
          </div>
        )}
        
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-game-token flex items-center justify-center animate-pulse-scale">
              <span className="font-bold text-white">SKS</span>
            </div>
          </div>
          <p className="text-lg mb-2">Reward: <span className="text-game-token font-bold">5 SKS Tokens</span></p>
          <p className="text-sm text-gray-400 mb-4">Tokens will be sent to your connected wallet</p>
          
          <Button
            onClick={handleClaimTokens}
            disabled={!adWatched || tokensClaimed || isLoading || !isConnected}
            className={`w-full ${!adWatched || !isConnected ? 'bg-gray-600' : tokensClaimed ? 'bg-green-700' : 'bg-game-token hover:bg-purple-600'}`}
          >
            {isLoading ? 'Processing...' : tokensClaimed ? 'Tokens Claimed!' : 'Claim SKS Tokens'}
          </Button>
          
          {!isConnected && (
            <p className="mt-2 text-xs text-yellow-400">Connect your wallet to claim tokens</p>
          )}
        </div>
        
        <div className="text-center space-y-2">
          <Button
            variant="outline"
            onClick={playAgain}
            className="w-full border-gray-600 text-white hover:bg-gray-800"
          >
            Play Again
          </Button>
        </div>
      </div>
      
      <p className="mt-6 text-sm text-gray-500 max-w-xs text-center">
        SKS tokens are distributed on the Polygon network. Make sure your wallet is connected to receive rewards.
      </p>
    </div>
  );
};

export default Reward;
