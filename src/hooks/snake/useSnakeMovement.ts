
import { useState, useRef, useEffect } from 'react';
import { Direction, Coordinate, INITIAL_SNAKE } from '@/components/snake/types';

export const useSnakeMovement = () => {
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('UP');
  
  const directionRef = useRef<Direction>(direction);
  const snakeRef = useRef<Coordinate[]>(snake);
  
  // Update refs when state changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  
  return {
    snake,
    setSnake,
    snakeRef,
    food,
    setFood,
    direction,
    setDirection,
    directionRef,
  };
};
