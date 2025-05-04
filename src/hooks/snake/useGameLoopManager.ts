
import { useEffect } from 'react';

interface UseGameLoopManagerProps {
  gameStarted: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  startGameLoop: () => void;
  gameLoopRef: React.MutableRefObject<number | null>;
}

export const useGameLoopManager = ({
  gameStarted,
  isGameOver,
  isPaused,
  startGameLoop,
  gameLoopRef
}: UseGameLoopManagerProps) => {
  // Start game loop when game starts
  useEffect(() => {
    if (gameStarted && !isGameOver && !isPaused) {
      startGameLoop();
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, isGameOver, isPaused, startGameLoop, gameLoopRef]);
};
