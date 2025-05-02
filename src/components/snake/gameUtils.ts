
import { Coordinate } from './types';

// Generate random food position
export const generateFood = (snake: Coordinate[]): Coordinate => {
  const GRID_SIZE = 20;
  
  const newFood = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  };
  
  // Ensure food doesn't appear on the snake
  const isOnSnake = snake.some(segment => 
    segment.x === newFood.x && segment.y === newFood.y
  );
  
  if (isOnSnake) {
    return generateFood(snake);
  }
  
  return newFood;
};

// Draw game on canvas
export const drawGame = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  snake: Coordinate[],
  food: Coordinate,
): void => {
  const CELL_SIZE = 20;
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear canvas
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  ctx.strokeStyle = '#1F1F1F';
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, 20 * CELL_SIZE);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(20 * CELL_SIZE, i * CELL_SIZE);
    ctx.stroke();
  }
  
  // Draw food
  ctx.fillStyle = '#F97316';
  ctx.beginPath();
  ctx.arc(
    food.x * CELL_SIZE + CELL_SIZE / 2,
    food.y * CELL_SIZE + CELL_SIZE / 2,
    CELL_SIZE / 2 - 2,
    0,
    2 * Math.PI
  );
  ctx.fill();
  
  // Draw snake
  snake.forEach((segment, index) => {
    // Head is brighter
    if (index === 0) {
      ctx.fillStyle = '#4ADE80';
    } else {
      // Body gets darker towards the tail
      const darkenFactor = Math.max(0.6, 1 - index * 0.03);
      ctx.fillStyle = `rgba(74, 222, 128, ${darkenFactor})`;
    }
    
    ctx.fillRect(
      segment.x * CELL_SIZE,
      segment.y * CELL_SIZE,
      CELL_SIZE - 1,
      CELL_SIZE - 1
    );
  });
};
