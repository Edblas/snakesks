
import React from 'react';
import { Button } from '@/components/ui/button';

interface GameOverlayProps {
  gameStarted: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  isConnected: boolean;
  isSavingScore: boolean;
  resetGame: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({
  gameStarted,
  isPaused,
  isGameOver,
  score,
  isConnected,
  isSavingScore,
  resetGame,
}) => {
  return (
    <>
      {!gameStarted && !isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-md">
          <h2 className="text-2xl font-bold text-white mb-4">Snake Token Arcade</h2>
          <p className="text-gray-300 mb-6 text-center px-4">Play, watch ads, earn SKS tokens!</p>
          <Button onClick={resetGame} className="bg-game-token hover:bg-purple-600">
            Start Game
          </Button>
        </div>
      )}
      
      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-md">
          <h2 className="text-2xl font-bold text-white mb-2">Game Over!</h2>
          <p className="text-xl text-game-token mb-4">Score: {score}</p>
          
          {!isConnected ? (
            <p className="mb-3 text-sm text-yellow-400">Connect wallet to save your score!</p>
          ) : isSavingScore ? (
            <p className="mb-3 text-sm text-green-400">Saving your score...</p>
          ) : (
            <p className="mb-3 text-sm text-green-400">Score saved to leaderboard!</p>
          )}
          
          <Button 
            onClick={() => window.location.href = '/reward'} 
            className="mb-3 bg-yellow-500 hover:bg-yellow-600"
          >
            Watch Ad for Tokens
          </Button>
          <Button onClick={resetGame} className="bg-game-token hover:bg-purple-600">
            Play Again
          </Button>
        </div>
      )}
      
      {isPaused && gameStarted && !isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-md">
          <h2 className="text-2xl font-bold text-white">Paused</h2>
        </div>
      )}
    </>
  );
};

export default GameOverlay;
