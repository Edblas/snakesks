
import { useState, useCallback, useRef } from 'react';

export const useGameState = () => {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isSavingScore, setIsSavingScore] = useState<boolean>(false);
  
  // Reference to track state changes
  const stateRef = useRef({
    isGameOver: false,
    isPaused: false
  });
  
  // Safe setter for isGameOver that updates the ref too
  const setIsGameOverSafe = useCallback((value: boolean) => {
    stateRef.current.isGameOver = value;
    setIsGameOver(value);
  }, []);
  
  // Safe setter for isPaused that updates the ref too
  const setIsPausedSafe = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    if (typeof value === 'function') {
      setIsPaused(prev => {
        const newValue = value(prev);
        stateRef.current.isPaused = newValue;
        return newValue;
      });
    } else {
      stateRef.current.isPaused = value;
      setIsPaused(value);
    }
  }, []);
  
  // Create a more reliable pause toggle function
  const togglePause = useCallback(() => {
    setIsPausedSafe(prev => !prev);
  }, [setIsPausedSafe]);
  
  // Create a clear reset function
  const resetGameState = useCallback(() => {
    setIsGameOverSafe(false);
    setIsPausedSafe(false);
    setGameStarted(true);
    setIsSavingScore(false);
  }, [setIsGameOverSafe, setIsPausedSafe]);
  
  return {
    isGameOver,
    setIsGameOver: setIsGameOverSafe,
    isPaused,
    setIsPaused: setIsPausedSafe,
    togglePause,
    gameStarted,
    setGameStarted,
    isSavingScore,
    setIsSavingScore,
    resetGameState,
    stateRef // Export the ref for direct state access
  };
};
