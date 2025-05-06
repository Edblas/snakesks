import { useRef, useCallback, useEffect } from 'react';
import { Coordinate, GRID_SIZE } from '@/components/snake/types';
import { generateFood, drawGame } from '@/components/snake/gameUtils';

interface UseSnakeGameLoopProps {
  isGameOver: boolean;
  isPaused: boolean;
  directionRef: React.MutableRefObject<"UP" | "DOWN" | "LEFT" | "RIGHT">;
  snakeRef: React.MutableRefObject<Coordinate[]>;
  setSnake: (snake: Coordinate[]) => void;
  food: Coordinate;
  setFood: (food: Coordinate) => void;
  score: number;
  setScore: (score: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  handleGameOver: () => void;
}

export const useSnakeGameLoop = ({
  isGameOver,
  isPaused,
  directionRef,
  snakeRef,
  setSnake,
  food,
  setFood,
  score,
  setScore,
  canvasRef,
  handleGameOver
}: UseSnakeGameLoopProps) => {
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  // Base speed - higher value = slower game
  const updateInterval = useRef<number>(150); // Default speed
  
  // Optimized game loop with requestAnimationFrame and speed control
  const gameLoop = useCallback((timestamp: number) => {
    // Stop the loop if game is over or paused
    if (isGameOver || isPaused) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }
    
    // Time-based speed control
    const elapsed = timestamp - lastUpdateTimeRef.current;
    
    // Only update snake position if enough time has passed
    if (elapsed >= updateInterval.current) {
      lastUpdateTimeRef.current = timestamp;
      
      const currentDirection = directionRef.current;
      const currentSnake = [...snakeRef.current];
      const head = { ...currentSnake[0] };
      
      // Move head based on direction
      switch (currentDirection) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }
      
      // Check for collisions with walls
      if (
        head.x < 0 || 
        head.x >= GRID_SIZE || 
        head.y < 0 || 
        head.y >= GRID_SIZE
      ) {
        handleGameOver();
        return;
      }
      
      // Check for collisions with self
      if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return;
      }
      
      // Create new snake array
      const newSnake = [head, ...currentSnake];
      
      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        // Increase score
        const newScore = score + 10;
        setScore(newScore);
        
        // Generate new food
        setFood(generateFood(newSnake));
        
        // Increase speed slightly when snake grows
        // Minimum speed limit to keep game playable
        updateInterval.current = Math.max(80, updateInterval.current - 3);
      } else {
        // Remove tail if no food was eaten
        newSnake.pop();
      }
      
      // Update snake state
      setSnake(newSnake);
      snakeRef.current = newSnake;
      
      // Draw game (only if canvas exists)
      if (canvasRef.current) {
        drawGame(canvasRef, newSnake, food);
      }
    }
    
    // Continue game loop
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [isGameOver, isPaused, directionRef, snakeRef, food, score, canvasRef, setSnake, setFood, setScore, handleGameOver]);

  // Start game loop with improved management
  const startGameLoop = useCallback(() => {
    // Cancel any existing animation frame first
    if (gameLoopRef.current !== null) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    // Only start if game is active
    if (!isPaused && !isGameOver) {
      lastUpdateTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop, isPaused, isGameOver]);

  // Reset speed when game restarts
  const resetSpeed = useCallback(() => {
    updateInterval.current = 150; // Reset to default speed
  }, []);
  
  return {
    gameLoop,
    gameLoopRef,
    startGameLoop,
    resetSpeed
  };
};
