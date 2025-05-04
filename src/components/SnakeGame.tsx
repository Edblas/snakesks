
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSnakeGame } from '@/hooks/snake/useSnakeGame';
import GameControls from '@/components/snake/GameControls';
import GameOverlay from '@/components/snake/GameOverlay';
import SplashScreen from '@/components/snake/SplashScreen';
import { useWeb3 } from '@/components/Web3Provider';
import { GRID_SIZE, CELL_SIZE } from '@/components/snake/types';

const SnakeGame: React.FC = () => {
  const { isConnected } = useWeb3();
  const {
    canvasRef,
    score,
    highScore,
    isGameOver,
    isPaused,
    gameStarted,
    showControls,
    setShowControls,
    isSavingScore,
    resetGame,
    togglePause,
    handleDirectionClick,
    showSplash,
    setShowSplash,
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
      
      <div className="mb-4 flex justify-between w-full max-w-[400px]">
        <div className="text-lg font-bold">Score: <span className="text-game-token">{score}</span></div>
        <div className="text-lg font-bold">High: <span className="text-game-token">{highScore}</span></div>
      </div>

      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
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

      {gameStarted && !isGameOver && (
        <Button 
          onClick={togglePause} 
          className="mb-5 bg-gray-700 hover:bg-gray-600"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
      )}

      <GameControls
        showControls={showControls}
        setShowControls={setShowControls}
        gameStarted={gameStarted}
        handleDirectionClick={handleDirectionClick}
      />
    </div>
  );
};

export default SnakeGame;
