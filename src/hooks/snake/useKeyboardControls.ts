
import { useEffect } from 'react';
import { Direction } from '@/components/snake/types';

interface UseKeyboardControlsProps {
  gameStarted: boolean;
  directionRef: React.MutableRefObject<Direction>;
  setDirection: (direction: Direction) => void;
  togglePause: () => void;
}

export const useKeyboardControls = ({
  gameStarted,
  directionRef,
  setDirection,
  togglePause
}: UseKeyboardControlsProps) => {
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
    };
  }, [gameStarted, togglePause, setDirection, directionRef]);
};
