
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

  // Update direction ref when direction changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Save score to Supabase
  const saveScore = async () => {
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
  };

  // Game loop
  const gameLoop = useCallback(() => {
    if (isGameOver || isPaused) return;
    
    const currentDirection = directionRef.current;
    const head = { ...snake[0] };
    
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
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      handleGameOver();
      return;
    }
    
    // Create new snake array
    const newSnake = [head, ...snake];
    
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
    
    // Update snake
    setSnake(newSnake);
  }, [isGameOver, isPaused, snake, food, score]);

  // Start game loop
  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    
    gameLoopRef.current = window.setInterval(() => {
      gameLoop();
    }, GAME_SPEED);
  }, [gameLoop]);

  // Handle game over
  const handleGameOver = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
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
  };

  // Reset game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection('UP');
    directionRef.current = 'UP';
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    setGameStarted(true);
    startGameLoop();
  };

  // Toggle pause
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

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
  const handleDirectionClick = (newDirection: Direction) => {
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
  };

  // Set up keyboard listeners and draw game
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
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
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, isGameOver, isPaused, startGameLoop]);

  // Resume/pause game loop when pause state changes
  useEffect(() => {
    if (gameStarted && !isGameOver) {
      if (isPaused) {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
          gameLoopRef.current = null;
        }
      } else {
        startGameLoop();
      }
    }
  }, [isPaused, gameStarted, isGameOver, startGameLoop]);

  // Draw game whenever snake or food changes
  useEffect(() => {
    drawGame(canvasRef, snake, food);
  }, [snake, food]);

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
