
import { useCallback } from 'react';
import { Direction } from '@/components/snake/types';

interface UseDirectionControlsProps {
  gameStarted: boolean;
  directionRef: React.MutableRefObject<Direction>;
  setDirection: (direction: Direction) => void;
}

export const useDirectionControls = ({
  gameStarted,
  directionRef,
  setDirection
}: UseDirectionControlsProps) => {
  // Handle direction clicks
  const handleDirectionClick = useCallback((newDirection: Direction) => {
    if (!gameStarted) return;
    
    const currentDirection = directionRef.current;
    
    switch (newDirection) {
      case 'UP':
        if (currentDirection !== 'DOWN') {
          setDirection('UP');
        }
        break;
      case 'DOWN':
        if (currentDirection !== 'UP') {
          setDirection('DOWN');
        }
        break;
      case 'LEFT':
        if (currentDirection !== 'RIGHT') {
          setDirection('LEFT');
        }
        break;
      case 'RIGHT':
        if (currentDirection !== 'LEFT') {
          setDirection('RIGHT');
        }
        break;
    }
  }, [gameStarted, setDirection, directionRef]);
  
  return { handleDirectionClick };
};
