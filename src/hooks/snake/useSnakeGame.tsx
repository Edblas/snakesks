
import { useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useWeb3 } from '@/components/Web3Provider';
import { Direction, INITIAL_SNAKE } from '@/components/snake/types';

// Import our hooks
import { useSnakeMovement } from './useSnakeMovement';
import { useSnakeScore } from './useSnakeScore';
import { useSnakeGameLoop } from './useSnakeGameLoop';
import { useSnakeControls } from './useSnakeControls';
import { useGameState } from './useGameState';
import { useSplashScreen } from './useSplashScreen';
import { useGameOver } from './useGameOver';
import { useKeyboardControls } from './useKeyboardControls';
import { useDirectionControls } from './useDirectionControls';
import { useGameInitialization } from './useGameInitialization';
import { useGameLoopManager } from './useGameLoopManager';

export const useSnakeGame = () => {
  const toast = useToast();
  const { isConnected, address } = useWeb3();
  
  // Initialize game state with improved state management
  const {
    isGameOver, setIsGameOver,
    isPaused, setIsPaused, togglePause,
    gameStarted, setGameStarted,
    isSavingScore, setIsSavingScore,
    resetGameState
  } = useGameState();
  
  // Initialize splash screen state
  const { showSplash, setShowSplash } = useSplashScreen();
  
  // Initialize movement-related state
  const { 
    snake, setSnake, snakeRef, 
    food, setFood, direction, 
    setDirection, directionRef 
  } = useSnakeMovement();
  
  // Initialize score-related state and functions
  const { 
    score, setScore, highScore, 
    setHighScore, saveScore 
  } = useSnakeScore(
    isConnected, 
    address, 
    isSavingScore, 
    setIsSavingScore, 
    toast
  );

  // Initialize game initialization (canvasRef and gameLoopRef)
  const { canvasRef, gameLoopRef } = useGameInitialization(setHighScore);
  
  // Initialize game over handler
  const { handleGameOver } = useGameOver({
    score,
    highScore,
    setHighScore,
    isConnected,
    address,
    saveScore,
    setIsGameOver,
    gameLoopRef
  });
  
  // Initialize game loop with improved performance
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
  
  // Initialize controls with better pause handling
  const { togglePause: handleTogglePause, resetGame } = useSnakeControls({
    setSnake,
    snakeRef,
    setFood,
    setDirection,
    directionRef,
    setIsGameOver,
    setIsPaused,
    togglePause, // Pass the togglePause function from useGameState
    isPaused,
    setScore,
    setGameStarted,
    gameLoopRef,
    startGameLoop,
    resetSpeed,
    INITIAL_SNAKE,
    resetGameState // Pass the resetGameState function
  });
  
  // Initialize direction controls
  const { handleDirectionClick } = useDirectionControls({
    gameStarted,
    directionRef,
    setDirection
  });
  
  // Initialize keyboard controls with better pause handling
  useKeyboardControls({
    gameStarted,
    directionRef,
    setDirection,
    togglePause: handleTogglePause // Use the optimized toggle function
  });
  
  // Initialize game loop manager with improved loop control
  useGameLoopManager({
    gameStarted,
    isGameOver,
    isPaused,
    startGameLoop,
    gameLoopRef
  });

  return {
    canvasRef,
    snake,
    food,
    direction,
    isGameOver,
    isPaused,
    score,
    highScore,
    showControls: true, // Always show controls
    gameStarted,
    isSavingScore,
    resetGame,
    togglePause: handleTogglePause,
    handleDirectionClick,
    showSplash,
    setShowSplash,
  };
};
