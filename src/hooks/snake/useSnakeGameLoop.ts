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
  
  // Reference to control if the game has already ended
  const gameOverCalledRef = useRef<boolean>(false);
  
  // Keep track of food position for stability
  const lastValidFoodRef = useRef<Coordinate>(food);
  
  // Optimized game loop with requestAnimationFrame and speed control
  const gameLoop = useCallback((timestamp: number) => {
    // Clear game over reference when restarting
    if (!isGameOver && gameOverCalledRef.current) {
      gameOverCalledRef.current = false;
    }
    
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
        // Ensure gameOver is called only once
        if (!gameOverCalledRef.current) {
          gameOverCalledRef.current = true;
          // Cancel animation frame first
          if (gameLoopRef.current !== null) {
            cancelAnimationFrame(gameLoopRef.current);
            gameLoopRef.current = null;
          }
          handleGameOver();
        }
        return;
      }
      
      // Check for collisions with self
      for (let i = 1; i < currentSnake.length; i++) {
        if (currentSnake[i].x === head.x && currentSnake[i].y === head.y) {
          // Ensure gameOver is called only once
          if (!gameOverCalledRef.current) {
            gameOverCalledRef.current = true;
            // Cancel animation frame first
            if (gameLoopRef.current !== null) {
              cancelAnimationFrame(gameLoopRef.current);
              gameLoopRef.current = null;
            }
            handleGameOver();
          }
          return;
        }
      }
      
      // Create new snake array
      const newSnake = [head, ...currentSnake];
      
      // Save current food state
      const currentFood = food;
      
      // Check if food is valid
      if (currentFood && typeof currentFood.x !== 'number' || typeof currentFood.y !== 'number' ||
          currentFood.x < 0 || currentFood.x >= GRID_SIZE || 
          currentFood.y < 0 || currentFood.y >= GRID_SIZE) {
        console.warn("Fixing invalid food position");
        const newFood = generateFood(newSnake);
        lastValidFoodRef.current = newFood;
        setFood(newFood);
      }
      
      // Check if snake ate food
      const ateFood = head.x === currentFood.x && head.y === currentFood.y;
      if (ateFood) {
        // Increase score
        const newScore = score + 10;
        setScore(newScore);
        
        // Generate new food
        try {
          const newFood = generateFood(newSnake);
          console.log("New food generated:", newFood);
          lastValidFoodRef.current = newFood;
          setFood(newFood);
        } catch (error) {
          console.error("Error generating food:", error);
          // Fallback to a valid position
          const fallbackFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
          };
          lastValidFoodRef.current = fallbackFood;
          setFood(fallbackFood);
        }
        
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
        // Use last valid food if current is invalid
        const foodToDraw = (food && typeof food.x === 'number' && typeof food.y === 'number' &&
                          food.x >= 0 && food.x < GRID_SIZE && 
                          food.y >= 0 && food.y < GRID_SIZE) 
                          ? food : lastValidFoodRef.current;
                          
        drawGame(canvasRef, newSnake, foodToDraw);
      }
    }
    
    // Continue game loop - only if the game hasn't ended
    if (!isGameOver && !isPaused && !gameOverCalledRef.current) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [isGameOver, isPaused, directionRef, snakeRef, food, score, canvasRef, setSnake, setFood, setScore, handleGameOver]);

  // Start game loop with improved management
  const startGameLoop = useCallback(() => {
    // Reset game over state
    gameOverCalledRef.current = false;
    
    // Cancel any existing animation frame first
    if (gameLoopRef.current !== null) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
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
  
  // Cleanup animation frame on component unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, []);
  
  return {
    gameLoop,
    gameLoopRef,
    startGameLoop,
    resetSpeed
  };
};
