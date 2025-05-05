
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
  // Define o intervalo entre atualizações (milissegundos) - quanto maior, mais lento o jogo
  const updateInterval = useRef<number>(200); // 200ms = velocidade reduzida
  
  // Optimized game loop with requestAnimationFrame and speed control
  const gameLoop = useCallback((timestamp: number) => {
    // Check for paused state immediately and return if paused
    if (isGameOver || isPaused) {
      return null;
    }
    
    // Controle de velocidade baseado no tempo
    const elapsed = timestamp - lastUpdateTimeRef.current;
    
    // Só atualiza a posição da cobra se passou tempo suficiente desde a última atualização
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
        return null;
      }
      
      // Check for collisions with self
      if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return null;
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
        
        // Diminui levemente o intervalo (aumenta um pouco a velocidade) quando a cobra cresce
        // Com um limite mínimo para não ficar muito rápido
        updateInterval.current = Math.max(120, updateInterval.current - 5);
        
        // Don't remove tail (snake grows)
      } else {
        // Remove tail
        newSnake.pop();
      }
      
      // Update snake with batched state update
      setSnake(newSnake);
      snakeRef.current = newSnake;
      
      // Draw game
      if (canvasRef.current) {
        drawGame(canvasRef, newSnake, food);
      }
    }
    
    // Continue game loop with requestAnimationFrame only if not paused or game over
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return gameLoopRef.current;
  }, [isGameOver, isPaused, directionRef, snakeRef, food, score, canvasRef, setSnake, setFood, setScore, handleGameOver]);

  // Start game loop with requestAnimationFrame
  const startGameLoop = useCallback(() => {
    // Clear any existing animation frame first
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    // Only start the game loop if the game is not paused
    if (!isPaused && !isGameOver) {
      lastUpdateTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop, isPaused, isGameOver]);

  // Resetar velocidade quando o jogo reinicia
  const resetSpeed = useCallback(() => {
    updateInterval.current = 200;
  }, []);
  
  return {
    gameLoop,
    gameLoopRef,
    startGameLoop,
    resetSpeed
  };
};
