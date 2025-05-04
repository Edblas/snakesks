
import { useCallback } from 'react';
import { Direction, Coordinate } from '@/components/snake/types';
import { generateFood } from '@/components/snake/gameUtils';

interface UseSnakeControlsProps {
  setSnake: (snake: Coordinate[]) => void;
  snakeRef: React.MutableRefObject<Coordinate[]>;
  setFood: (food: Coordinate) => void;
  setDirection: (direction: Direction) => void;
  directionRef: React.MutableRefObject<Direction>;
  setIsGameOver: (isGameOver: boolean) => void;
  setIsPaused: (isPaused: boolean | ((prev: boolean) => boolean)) => void;
  setScore: (score: number) => void;
  setGameStarted: (gameStarted: boolean) => void;
  gameLoopRef: React.MutableRefObject<number | null>;
  startGameLoop: () => void;
  INITIAL_SNAKE: Coordinate[];
}

export const useSnakeControls = ({
  setSnake,
  snakeRef,
  setFood,
  setDirection,
  directionRef,
  setIsGameOver,
  setIsPaused,
  setScore,
  setGameStarted,
  gameLoopRef,
  startGameLoop,
  INITIAL_SNAKE
}: UseSnakeControlsProps) => {
  // Toggle pause - fixed by updating the type definition of setIsPaused
  const togglePause = useCallback(() => {
    setIsPaused((prev: boolean) => {
      const newPaused = !prev;
      
      if (newPaused) {
        // Cancel animation frame when paused
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
          gameLoopRef.current = null;
        }
      } else {
        // Start animation frame when resumed
        startGameLoop();
      }
      
      return newPaused;
    });
  }, [startGameLoop, gameLoopRef, setIsPaused]);
  
  // Reset game
  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    snakeRef.current = INITIAL_SNAKE;
    setFood(generateFood(INITIAL_SNAKE));
    setDirection('UP');
    directionRef.current = 'UP';
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    setGameStarted(true);
    
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    // Start with a slight delay to allow state updates
    setTimeout(() => {
      startGameLoop();
    }, 50);
  }, [startGameLoop, setSnake, snakeRef, setFood, setDirection, directionRef, setIsGameOver, setIsPaused, setScore, setGameStarted, gameLoopRef, INITIAL_SNAKE]);
  
  return {
    togglePause,
    resetGame,
  };
};
