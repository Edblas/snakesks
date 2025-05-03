
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSnakeScore = (
  isConnected: boolean,
  address: string | undefined,
  isSavingScore: boolean,
  setIsSavingScore: (value: boolean) => void,
  toast: ReturnType<typeof useToast>
) => {
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  
  // Save score to Supabase - optimized to prevent re-renders
  const saveScore = useCallback(async (currentScore: number) => {
    if (!isConnected || !address || currentScore === 0 || isSavingScore) return;
    
    try {
      setIsSavingScore(true);
      
      const { error } = await supabase
        .from('scores')
        .insert([
          { user_id: address, score: currentScore }
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
  }, [isConnected, address, isSavingScore, setIsSavingScore, toast]);
  
  return {
    score,
    setScore,
    highScore,
    setHighScore,
    saveScore,
  };
};
