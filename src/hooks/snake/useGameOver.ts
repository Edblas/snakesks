
import { useToast } from '@/components/ui/use-toast';
import { useCallback } from 'react';

interface UseGameOverProps {
  score: number;
  highScore: number;
  setHighScore: (score: number) => void;
  isConnected: boolean;
  address: string | undefined;
  saveScore: (score: number) => void;
  setIsGameOver: (isGameOver: boolean) => void;
  gameLoopRef: React.MutableRefObject<number | null>;
}

export const useGameOver = ({
  score,
  highScore,
  setHighScore,
  isConnected,
  address,
  saveScore,
  setIsGameOver,
  gameLoopRef
}: UseGameOverProps) => {
  const toast = useToast();
  
  const handleGameOver = useCallback(() => {
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
  }, [score, highScore, setHighScore, isConnected, address, saveScore, setIsGameOver, gameLoopRef, toast]);
  
  return { handleGameOver };
};
