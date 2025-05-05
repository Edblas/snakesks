
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSnakeGame } from '@/hooks/snake/useSnakeGame';
import GameControls from '@/components/snake/GameControls';
import GameOverlay from '@/components/snake/GameOverlay';
import SplashScreen from '@/components/snake/SplashScreen';
import { useWeb3 } from '@/components/Web3Provider';
import { GRID_SIZE, CELL_SIZE } from '@/components/snake/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Pause, Play } from 'lucide-react';

// Define a smaller size for the game board
const GAME_SCALE = 0.8; // 80% of the original size
const SCALED_CELL_SIZE = Math.floor(CELL_SIZE * GAME_SCALE);

const SnakeGame: React.FC = () => {
  const { isConnected } = useWeb3();
  const isMobile = useIsMobile();
  const {
    canvasRef,
    score,
    highScore,
    isGameOver,
    isPaused,
    gameStarted,
    showControls,
    handleDirectionClick,
    showSplash,
    setShowSplash,
    isSavingScore,
    resetGame,
    togglePause,
  } = useSnakeGame();

  // Handle splash screen start
  const handleSplashStart = () => {
    setShowSplash(false);
    resetGame();
  };

  return (
    <div className="flex flex-col items-center">
      {showSplash && (
        <SplashScreen onStart={handleSplashStart} />
      )}
      
      <div className="mb-2 flex justify-between w-full max-w-[320px]">
        <div className="text-lg font-bold">Score: <span className="text-game-token">{score}</span></div>
        <div className="text-lg font-bold">High: <span className="text-game-token">{highScore}</span></div>
      </div>

      <div className="relative mb-2">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * SCALED_CELL_SIZE}
          height={GRID_SIZE * SCALED_CELL_SIZE}
          className="border-2 border-gray-700 rounded-md"
          style={{ imageRendering: 'pixelated' }}
        />
        
        <GameOverlay
          gameStarted={gameStarted}
          isPaused={isPaused}
          isGameOver={isGameOver}
          score={score}
          isConnected={isConnected}
          isSavingScore={isSavingScore}
          resetGame={resetGame}
        />
      </div>

      <div className="flex flex-col items-center gap-1">
        {gameStarted && !isGameOver && (
          <Button 
            onClick={togglePause}
            className="mb-1 bg-gray-700 hover:bg-gray-600"
            size={isMobile ? "sm" : "default"}
          >
            {isPaused ? <Play className="mr-1" /> : <Pause className="mr-1" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        )}

        <GameControls
          gameStarted={gameStarted}
          handleDirectionClick={handleDirectionClick}
        />
      </div>
    </div>
  );
};

export default SnakeGame;
