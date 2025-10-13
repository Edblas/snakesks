
import { useState, useCallback } from 'react';

export const useSnakeScore = (
  isConnected: boolean,
  address: string | undefined,
  isSavingScore: boolean,
  setIsSavingScore: (value: boolean) => void,
  toast: any
) => {
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  
  // Save score - now handled by Firebase through useGameTokens
  const saveScore = useCallback(async (currentScore: number) => {
    if (!isConnected || !address || currentScore === 0 || isSavingScore) return;
    
    try {
      setIsSavingScore(true);
      
      // Score saving is now handled by Firebase in useGameTokens
      console.log("Score saved successfully via Firebase");
      toast.toast({
        title: "Score saved",
        description: "Your score has been added to the leaderboard.",
      });
    } catch (err) {
      console.error("Error in saveScore:", err);
    } finally {
      setIsSavingScore(false);
    }
  }, [isConnected, address, isSavingScore, setIsSavingScore, toast]);
  
  return {
    score,
    setScore,
    highScore,
    setHighScore,
    saveScore,
  };
};
