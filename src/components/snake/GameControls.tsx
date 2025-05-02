
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';
import { Direction } from './types';

interface GameControlsProps {
  showControls: boolean;
  setShowControls: (show: boolean) => void;
  gameStarted: boolean;
  handleDirectionClick: (direction: Direction) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  showControls,
  setShowControls,
  gameStarted,
  handleDirectionClick,
}) => {
  return (
    <>
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => setShowControls(!showControls)}
          className="text-sm"
        >
          {showControls ? 'Hide Controls' : 'Show Controls'}
        </Button>
      </div>
      
      {showControls && (
        <div className="grid grid-cols-3 gap-2 mb-4 w-[150px]">
          <div></div>
          <Button 
            onClick={() => handleDirectionClick('UP')}
            className="p-2 bg-gray-800 hover:bg-gray-700"
            aria-label="Move Up"
          >
            <ArrowUp />
          </Button>
          <div></div>
          <Button 
            onClick={() => handleDirectionClick('LEFT')}
            className="p-2 bg-gray-800 hover:bg-gray-700"
            aria-label="Move Left"
          >
            <ArrowLeft />
          </Button>
          <div></div>
          <Button 
            onClick={() => handleDirectionClick('RIGHT')}
            className="p-2 bg-gray-800 hover:bg-gray-700"
            aria-label="Move Right"
          >
            <ArrowRight />
          </Button>
          <div></div>
          <Button 
            onClick={() => handleDirectionClick('DOWN')}
            className="p-2 bg-gray-800 hover:bg-gray-700"
            aria-label="Move Down"
          >
            <ArrowDown />
          </Button>
          <div></div>
        </div>
      )}

      {!gameStarted && (
        <div className="mt-2 text-sm text-center text-gray-500">
          <p>Use arrow keys to control the snake</p>
          <p>Press space to pause/resume</p>
        </div>
      )}
    </>
  );
};

export default GameControls;
