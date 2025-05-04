
import { useEffect, useRef } from 'react';
import { INITIAL_SNAKE } from '@/components/snake/types';

export const useGameInitialization = (setHighScore: (score: number) => void) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  
  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, [setHighScore]);
  
  return {
    canvasRef,
    gameLoopRef,
  };
};
