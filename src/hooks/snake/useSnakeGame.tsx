
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useWeb3 } from '@/components/Web3Provider';
import { Direction, Coordinate, INITIAL_SNAKE } from '@/components/snake/types';
import { generateFood } from '@/components/snake/gameUtils';
import { useSnakeMovement } from './useSnakeMovement';
import { useSnakeScore } from './useSnakeScore';
import { useSnakeGameLoop } from './useSnakeGameLoop';
import { useSnakeControls } from './useSnakeControls';

export const useSnakeGame = () => {
  const toast = useToast();
  const { isConnected, address } = useWeb3();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isSavingScore, setIsSavingScore] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  
  // Initialize movement-related state first
  const { 
    snake, 
    setSnake, 
    snakeRef, 
    food, 
    setFood, 
    direction, 
    setDirection, 
    directionRef 
  } = useSnakeMovement();
  
  // Initialize score-related state and functions
  const { 
    score, 
    setScore, 
    highScore, 
    setHighScore, 
    saveScore 
  } = useSnakeScore(
    isConnected, 
    address, 
    isSavingScore, 
    setIsSavingScore, 
    toast
  );

  // Initialize gameLoopRef before passing to any hooks
  const gameLoopRef = useRef<number | null>(null);
  
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

    toast.toast({
      title: "Game Over!",
      description: `Your score: ${score}. Watch an ad to earn SKS tokens!`,
    });
  };

  // Initialize game loop
  const { startGameLoop, resetSpeed } = useSnakeGameLoop({
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
  
  // Initialize controls after startGameLoop is defined
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
    resetSpeed,  // Passando a nova função
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
  }, [gameStarted, togglePause, setDirection, directionRef]);

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
    showSplash,
    setShowSplash,
  };
};
