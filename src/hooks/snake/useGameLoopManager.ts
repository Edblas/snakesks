
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
  // Start game loop when game starts and ensure proper cleanup
  useEffect(() => {
    let timeoutId: number | null = null;
    
    if (gameStarted && !isGameOver && !isPaused) {
      // Short timeout to ensure state is fully updated
      timeoutId = window.setTimeout(() => {
        startGameLoop();
      }, 10);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameStarted, isGameOver, isPaused, startGameLoop, gameLoopRef]);
};
