
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
  togglePause: () => void; // Use the new togglePause function
  isPaused: boolean;
  setScore: (score: number) => void;
  setGameStarted: (gameStarted: boolean) => void;
  gameLoopRef: React.MutableRefObject<number | null>;
  startGameLoop: () => void;
  resetSpeed: () => void;
  INITIAL_SNAKE: Coordinate[];
  resetGameState: () => void; // Use the new resetGameState function
}

export const useSnakeControls = ({
  setSnake,
  snakeRef,
  setFood,
  setDirection,
  directionRef,
  setIsGameOver,
  setIsPaused,
  togglePause,
  isPaused,
  setScore,
  setGameStarted,
  gameLoopRef,
  startGameLoop,
  resetSpeed,
  INITIAL_SNAKE,
  resetGameState
}: UseSnakeControlsProps) => {
  // Handle pause toggle with proper animation frame management
  const handleTogglePause = useCallback(() => {
    togglePause();
    
    // If we're unpausing, restart the game loop
    if (isPaused) {
      startGameLoop();
    } else {
      // If we're pausing, cancel the animation frame
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }
  }, [togglePause, isPaused, startGameLoop, gameLoopRef]);
  
  // Reset game with better state management
  const resetGame = useCallback(() => {
    // Cancel any existing game loop
    if (gameLoopRef.current !== null) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    // Reset game state using the new function
    resetGameState();
    
    // Reset gameplay elements
    setSnake(INITIAL_SNAKE);
    snakeRef.current = INITIAL_SNAKE;
    setFood(generateFood(INITIAL_SNAKE));
    setDirection('UP');
    directionRef.current = 'UP';
    setScore(0);
    resetSpeed();
    
    // Start with a slight delay to allow state updates
    setTimeout(() => {
      startGameLoop();
    }, 50);
  }, [
    gameLoopRef, resetGameState, setSnake, snakeRef, setFood, 
    setDirection, directionRef, setScore, resetSpeed, 
    INITIAL_SNAKE, startGameLoop
  ]);
  
  return {
    togglePause: handleTogglePause,
    resetGame,
  };
};
