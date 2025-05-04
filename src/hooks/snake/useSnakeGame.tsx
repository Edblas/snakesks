
import { useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useWeb3 } from '@/components/Web3Provider';
import { Direction, INITIAL_SNAKE } from '@/components/snake/types';

// Import our new smaller hooks
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
  
  // Initialize game state
  const {
    isGameOver, setIsGameOver,
    isPaused, setIsPaused,
    gameStarted, setGameStarted,
    showControls, setShowControls,
    isSavingScore, setIsSavingScore
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
  
  // Initialize controls
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
    resetSpeed,
    INITIAL_SNAKE
  });
  
  // Initialize direction controls
  const { handleDirectionClick } = useDirectionControls({
    gameStarted,
    directionRef,
    setDirection
  });
  
  // Initialize keyboard controls
  useKeyboardControls({
    gameStarted,
    directionRef,
    setDirection,
    togglePause
  });
  
  // Initialize game loop manager
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
