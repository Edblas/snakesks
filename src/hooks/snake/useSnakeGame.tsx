
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useWeb3 } from '@/components/Web3Provider';
import { Direction, Coordinate, INITIAL_SNAKE } from '@/components/snake/types';
import { useSnakeMovement } from './useSnakeMovement';
import { useSnakeScore } from './useSnakeScore';
import { useSnakeControls } from './useSnakeControls';
import { useSnakeGameLoop } from './useSnakeGameLoop';

export const useSnakeGame = () => {
  const { toast } = useToast();
  const { isConnected, address } = useWeb3();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isSavingScore, setIsSavingScore] = useState<boolean>(false);
  
  const { snake, setSnake, snakeRef, food, setFood, direction, setDirection, directionRef } = useSnakeMovement();
  const { score, setScore, highScore, setHighScore, saveScore } = useSnakeScore(isConnected, address, isSavingScore, setIsSavingScore, toast);
  
  // Handle game over
  const handleGameOver = () => {
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
      saveScore(score);
    }

    toast({
      title: "Game Over!",
      description: `Your score: ${score}. Watch an ad to earn SKS tokens!`,
    });
  };
  
  const { togglePause, resetGame } = useSnakeControls({
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
  });
  
  // Handle direction clicks
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

  const { gameLoop, gameLoopRef, startGameLoop } = useSnakeGameLoop({
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
  });

  // Set up keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, togglePause, directionRef, gameLoopRef]);

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

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

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
