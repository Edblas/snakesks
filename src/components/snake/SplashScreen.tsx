
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface SplashScreenProps {
  onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [adWatched, setAdWatched] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  // Simulate ad viewing with a countdown
  useEffect(() => {
    if (!adWatched) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setAdWatched(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [adWatched]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95">
      <div className="max-w-md w-full p-6 flex flex-col items-center">
        <img 
          src="/lovable-uploads/f4f63067-b913-4c51-8019-d2a0107e7e9d.png" 
          alt="SKS Logo" 
          className="w-48 h-48 mb-6"
        />
        
        <h1 className="text-2xl font-bold text-game-token mb-2 text-center">SKS-Connecting people</h1>
        <p className="text-gray-300 mb-8 text-center">The crypto behind the game</p>
        
        {!adWatched ? (
          <div className="w-full bg-gray-800 p-4 rounded-lg mb-6">
            <p className="text-center mb-2">Ad playing...</p>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-game-token h-full transition-all duration-1000" 
                style={{ width: `${(1 - countdown/5) * 100}%` }}
              />
            </div>
            <p className="text-center mt-2 text-sm text-gray-400">
              Please watch the ad ({countdown}s remaining)
            </p>
          </div>
        ) : (
          <Button 
            onClick={onStart} 
            className="bg-game-token hover:bg-purple-600"
          >
            Start Game
          </Button>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
