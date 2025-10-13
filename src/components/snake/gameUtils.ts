
import { Coordinate, GRID_SIZE } from './types';

// Generate random food position
export const generateFood = (snake: Coordinate[]): Coordinate => {
  
  let newFood = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  };
  
  // Ensure food doesn't appear on the snake
  let isOnSnake = snake.some(segment => 
    segment.x === newFood.x && segment.y === newFood.y
  );
  
  // Ensure the food doesn't appear on the snake
  let attempts = 0;
  const maxAttempts = 100;
  
  while (isOnSnake && attempts < maxAttempts) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    isOnSnake = snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    );
    
    attempts++;
  }
  
  // Safety check - if we couldn't find a valid position after many attempts
  if (attempts >= maxAttempts) {
    console.warn("Couldn't find valid food position after many attempts");
    // Try more aggressively with different coordinates
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!snake.some(segment => segment.x === x && segment.y === y)) {
          return { x, y };
        }
      }
    }
  }
  
  console.log("Food generated at:", newFood);
  return newFood;
};

export const drawGame = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  snake: Coordinate[],
  food: Coordinate | null
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Calculate cell size based on canvas dimensions
  const cellSize = canvas.width / GRID_SIZE;

  // Clear canvas with background color
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_SIZE; i++) {
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();
    
    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }

  // Draw food
  if (food && food.x >= 0 && food.x < GRID_SIZE && food.y >= 0 && food.y < GRID_SIZE) {
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(
      food.x * cellSize + 1,
      food.y * cellSize + 1,
      cellSize - 2,
      cellSize - 2
    );
  }

  // Draw snake
  snake.forEach((segment, index) => {
    if (index === 0) {
      // Head
      ctx.fillStyle = '#4ecdc4';
    } else {
      // Body
      ctx.fillStyle = '#45b7aa';
    }
    
    ctx.fillRect(
      segment.x * cellSize + 1,
      segment.y * cellSize + 1,
      cellSize - 2,
      cellSize - 2
    );
  });
};
