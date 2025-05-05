
import { useState, useCallback } from 'react';

export const useGameState = () => {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isSavingScore, setIsSavingScore] = useState<boolean>(false);
  
  // Create a more reliable pause toggle function
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);
  
  // Create a clear reset function
  const resetGameState = useCallback(() => {
    setIsGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    setIsSavingScore(false);
  }, []);
  
  return {
    isGameOver,
    setIsGameOver,
    isPaused,
    setIsPaused,
    togglePause,
    gameStarted,
    setGameStarted,
    isSavingScore,
    setIsSavingScore,
    resetGameState
  };
};
