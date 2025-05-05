
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';
import { Direction } from './types';
import { useIsMobile } from '@/hooks/use-mobile';

interface GameControlsProps {
  gameStarted: boolean;
  handleDirectionClick: (direction: Direction) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameStarted,
  handleDirectionClick,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className={`grid grid-cols-3 gap-2 mb-2 ${isMobile ? 'w-[120px]' : 'w-[150px]'}`}>
        <div></div>
        <Button 
          onClick={() => handleDirectionClick('UP')}
          className="p-1 bg-gray-800 hover:bg-gray-700"
          aria-label="Move Up"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowUp className={isMobile ? "h-4 w-4" : ""} />
        </Button>
        <div></div>
        <Button 
          onClick={() => handleDirectionClick('LEFT')}
          className="p-1 bg-gray-800 hover:bg-gray-700"
          aria-label="Move Left"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowLeft className={isMobile ? "h-4 w-4" : ""} />
        </Button>
        <div></div>
        <Button 
          onClick={() => handleDirectionClick('RIGHT')}
          className="p-1 bg-gray-800 hover:bg-gray-700"
          aria-label="Move Right"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowRight className={isMobile ? "h-4 w-4" : ""} />
        </Button>
        <div></div>
        <Button 
          onClick={() => handleDirectionClick('DOWN')}
          className="p-1 bg-gray-800 hover:bg-gray-700"
          aria-label="Move Down"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowDown className={isMobile ? "h-4 w-4" : ""} />
        </Button>
        <div></div>
      </div>

      {!gameStarted && (
        <div className="mt-1 text-xs text-center text-gray-500">
          <p>Use arrow keys to control the snake</p>
          <p>Press space to pause/resume</p>
        </div>
      )}
    </>
  );
};

export default GameControls;
