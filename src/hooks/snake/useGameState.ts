
import { useState } from 'react';

export const useGameState = () => {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isSavingScore, setIsSavingScore] = useState<boolean>(false);
  
  return {
    isGameOver,
    setIsGameOver,
    isPaused,
    setIsPaused,
    gameStarted,
    setGameStarted,
    isSavingScore,
    setIsSavingScore,
  };
};
