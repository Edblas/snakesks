
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useWeb3 } from '@/components/Web3Provider';
import { Direction, Coordinate, INITIAL_SNAKE, GRID_SIZE, GAME_SPEED } from '@/components/snake/types';
import { generateFood, drawGame } from '@/components/snake/gameUtils';

export const useSnakeGame = () => {
  const { toast } = useToast();
  const { isConnected, address } = useWeb3();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isSavingScore, setIsSavingScore] = useState<boolean>(false);
  
  const directionRef = useRef<Direction>(direction);
  const gameLoopRef = useRef<number | null>(null);
  const snakeRef = useRef<Coordinate[]>(snake);

  // Update refs when state changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Save score to Supabase - optimized to prevent re-renders
  const saveScore = useCallback(async () => {
    if (!isConnected || !address || score === 0 || isSavingScore) return;
    
    try {
      setIsSavingScore(true);
      
      const { error } = await supabase
        .from('scores')
        .insert([
          { user_id: address, score: score }
        ]);
      
      if (error) {
        console.error("Error saving score:", error);
        toast({
          title: "Score not saved",
          description: "There was a problem saving your score.",
          variant: "destructive"
        });
      } else {
        console.log("Score saved successfully");
        toast({
          title: "Score saved",
          description: "Your score has been added to the leaderboard.",
        });
      }
    } catch (err) {
      console.error("Error in saveScore:", err);
    } finally {
      setIsSavingScore(false);
    }
  }, [isConnected, address, score, isSavingScore, toast]);

  // Optimized game loop with requestAnimationFrame
  const gameLoop = useCallback(() => {
    if (isGameOver || isPaused) return null;
    
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
    
    // Continue game loop with requestAnimationFrame
    return requestAnimationFrame(gameLoop);
  }, [isGameOver, isPaused, food, score]);

  // Start game loop with requestAnimationFrame
  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  // Handle game over
  const handleGameOver = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    setIsGameOver(true);
    
    // Update high score if needed
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }

    // Save score to database if user is connected
    if (isConnected && address) {
      saveScore();
    }

    toast({
      title: "Game Over!",
      description: `Your score: ${score}. Watch an ad to earn SKS tokens!`,
    });
  }, [score, highScore, isConnected, address, saveScore, toast]);

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
  }, [startGameLoop]);

  // Toggle pause
  const togglePause = useCallback(() => {
    setIsPaused(prev => {
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
  }, [startGameLoop]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!gameStarted) return;
    
    const currentDirection = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
        if (currentDirection !== 'DOWN') {
          setDirection('UP');
        }
        break;
      case 'ArrowDown':
        if (currentDirection !== 'UP') {
          setDirection('DOWN');
        }
        break;
      case 'ArrowLeft':
        if (currentDirection !== 'RIGHT') {
          setDirection('LEFT');
        }
        break;
      case 'ArrowRight':
        if (currentDirection !== 'LEFT') {
          setDirection('RIGHT');
        }
        break;
      case ' ':
        togglePause();
        break;
    }
  }, [gameStarted, togglePause]);

  // Handle direction button clicks
  const handleDirectionClick = useCallback((newDirection: Direction) => {
    if (!gameStarted) return;
    
    const currentDirection = directionRef.current;
    
    switch (newDirection) {
      case 'UP':
        if (currentDirection !== 'DOWN') {
          setDirection('UP');
        }
        break;
      case 'DOWN':
        if (currentDirection !== 'UP') {
          setDirection('DOWN');
        }
        break;
      case 'LEFT':
        if (currentDirection !== 'RIGHT') {
          setDirection('LEFT');
        }
        break;
      case 'RIGHT':
        if (currentDirection !== 'LEFT') {
          setDirection('RIGHT');
        }
        break;
    }
  }, [gameStarted]);

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [handleKeyDown]);

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
  }, [gameStarted, isGameOver, isPaused, startGameLoop]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  // Stop drawing game on every render, only draw when snake or food changes
  useEffect(() => {
    if (gameStarted && !isGameOver) {
      drawGame(canvasRef, snake, food);
    }
  }, [snake, food, gameStarted, isGameOver]);

  return {
    canvasRef,
    snake,
    food,
    direction,
    isGameOver,
    isPaused,
    score,
    highScore,
    showControls,
    setShowControls,
    gameStarted,
    isSavingScore,
    resetGame,
    togglePause,
    handleDirectionClick,
  };
};
