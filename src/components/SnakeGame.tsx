
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useWeb3 } from '@/components/Web3Provider';

// Define types
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Coordinate = {
  x: number;
  y: number;
};

// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const GAME_SPEED = 150;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];

const SnakeGame: React.FC = () => {
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

  // Generate random food position
  const generateFood = useCallback((): Coordinate => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    // Ensure food doesn't appear on the snake
    const isOnSnake = snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    );
    
    if (isOnSnake) {
      return generateFood();
    }
    
    return newFood;
  }, [snake]);

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

  // Draw game on canvas
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#1F1F1F';
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }
    
    // Draw food
    ctx.fillStyle = '#F97316';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    
    // Draw snake
    snake.forEach((segment, index) => {
      // Head is brighter
      if (index === 0) {
        ctx.fillStyle = '#4ADE80';
      } else {
        // Body gets darker towards the tail
        const darkenFactor = Math.max(0.6, 1 - index * 0.03);
        ctx.fillStyle = `rgba(74, 222, 128, ${darkenFactor})`;
      }
      
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
    });
  }, [snake, food]);

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
      setFood(generateFood());
      
      // Don't remove tail (snake grows)
    } else {
      // Remove tail
      newSnake.pop();
    }
    
    // Update snake
    setSnake(newSnake);
  }, [isGameOver, isPaused, snake, food, score, generateFood]);

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
    setFood(generateFood());
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
  }, [gameStarted]);

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
    drawGame();
  }, [snake, food, drawGame]);

  return (
    <div className="flex flex-col items-center">
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
        />
        
        {!gameStarted && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-md">
            <h2 className="text-2xl font-bold text-white mb-4">Snake Token Arcade</h2>
            <p className="text-gray-300 mb-6 text-center px-4">Play, watch ads, earn SKS tokens!</p>
            <Button onClick={resetGame} className="bg-game-token hover:bg-purple-600">
              Start Game
            </Button>
          </div>
        )}
        
        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-md">
            <h2 className="text-2xl font-bold text-white mb-2">Game Over!</h2>
            <p className="text-xl text-game-token mb-4">Score: {score}</p>
            
            {!isConnected ? (
              <p className="mb-3 text-sm text-yellow-400">Connect wallet to save your score!</p>
            ) : isSavingScore ? (
              <p className="mb-3 text-sm text-green-400">Saving your score...</p>
            ) : (
              <p className="mb-3 text-sm text-green-400">Score saved to leaderboard!</p>
            )}
            
            <Button 
              onClick={() => window.location.href = '/reward'} 
              className="mb-3 bg-yellow-500 hover:bg-yellow-600"
            >
              Watch Ad for Tokens
            </Button>
            <Button onClick={resetGame} className="bg-game-token hover:bg-purple-600">
              Play Again
            </Button>
          </div>
        )}
        
        {isPaused && gameStarted && !isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-md">
            <h2 className="text-2xl font-bold text-white">Paused</h2>
          </div>
        )}
      </div>

      {gameStarted && !isGameOver && (
        <Button 
          onClick={togglePause} 
          className="mb-5 bg-gray-700 hover:bg-gray-600"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
      )}

      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => setShowControls(!showControls)}
          className="text-sm"
        >
          {showControls ? 'Hide Controls' : 'Show Controls'}
        </Button>
      </div>
      
      {showControls && (
        <div className="grid grid-cols-3 gap-2 mb-4 w-[150px]">
          <div></div>
          <Button 
            onClick={() => handleDirectionClick('UP')}
            className="p-2 bg-gray-800 hover:bg-gray-700"
            aria-label="Move Up"
          >
            <ArrowUp />
          </Button>
          <div></div>
          <Button 
            onClick={() => handleDirectionClick('LEFT')}
            className="p-2 bg-gray-800 hover:bg-gray-700"
            aria-label="Move Left"
          >
            <ArrowLeft />
          </Button>
          <div></div>
          <Button 
            onClick={() => handleDirectionClick('RIGHT')}
            className="p-2 bg-gray-800 hover:bg-gray-700"
            aria-label="Move Right"
          >
            <ArrowRight />
          </Button>
          <div></div>
          <Button 
            onClick={() => handleDirectionClick('DOWN')}
            className="p-2 bg-gray-800 hover:bg-gray-700"
            aria-label="Move Down"
          >
            <ArrowDown />
          </Button>
          <div></div>
        </div>
      )}

      {!gameStarted && (
        <div className="mt-2 text-sm text-center text-gray-500">
          <p>Use arrow keys to control the snake</p>
          <p>Press space to pause/resume</p>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
