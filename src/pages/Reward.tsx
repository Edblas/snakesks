
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Reward = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [adWatched, setAdWatched] = useState(false);
  const [tokensClaimed, setTokensClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Simulate ad loading and watching
  useEffect(() => {
    if (!adWatched && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    if (!adWatched && countdown === 0) {
      setAdWatched(true);
      toast({
        title: "Ad completed!",
        description: "You can now claim your SKS tokens.",
      });
    }
  }, [adWatched, countdown, toast]);

  const handleClaimTokens = () => {
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Earn SKS Tokens</h1>
        
        <div className="mb-8 bg-gray-800 rounded-lg p-4 text-center">
          {!adWatched ? (
            <>
              <div className="animate-pulse mb-4 h-40 bg-gray-700 rounded flex items-center justify-center">
                <p className="text-xl">Ad loading... {countdown}</p>
              </div>
              <p className="text-sm text-gray-400">Please wait while the ad loads...</p>
            </>
          ) : (
            <div className="py-4">
              <div className="mb-4 h-40 bg-gray-700 rounded flex items-center justify-center">
                <p className="text-xl">Ad completed!</p>
              </div>
              <p className="text-green-400 font-semibold">Thanks for watching!</p>
            </div>
          )}
        </div>
        
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
            disabled={!adWatched || tokensClaimed || isLoading}
            className={`w-full ${!adWatched ? 'bg-gray-600' : tokensClaimed ? 'bg-green-700' : 'bg-game-token hover:bg-purple-600'}`}
          >
            {isLoading ? 'Processing...' : tokensClaimed ? 'Tokens Claimed!' : 'Claim SKS Tokens'}
          </Button>
        </div>
        
        <div className="text-center">
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
