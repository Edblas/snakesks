
import { Coordinate } from './types';

// Generate random food position
export const generateFood = (snake: Coordinate[]): Coordinate => {
  const GRID_SIZE = 20;
  
  let newFood = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  };
  
  // Ensure food doesn't appear on the snake
  const isOnSnake = snake.some(segment => 
    segment.x === newFood.x && segment.y === newFood.y
  );
  
  if (isOnSnake) {
    // Garantir que a recursão não entre em loop infinito
    // tentando no máximo 100 vezes encontrar uma posição válida
    let attempts = 0;
    while (isOnSnake && attempts < 100) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      attempts++;
    }
  }
  
  return newFood;
};

// Draw game on canvas with improved performance
export const drawGame = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  snake: Coordinate[],
  food: Coordinate,
): void => {
  const CELL_SIZE = 20;
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;
  
  // Clear canvas - faster method
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw lighter grid for better performance
  ctx.strokeStyle = '#1F1F1F';
  ctx.beginPath();
  
  // Draw vertical grid lines
  for (let i = 0; i <= 20; i++) {
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, 20 * CELL_SIZE);
  }
  
  // Draw horizontal grid lines
  for (let i = 0; i <= 20; i++) {
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(20 * CELL_SIZE, i * CELL_SIZE);
  }
  
  ctx.stroke();
  
  // Draw food - verificar se a comida existe
  if (food && typeof food.x === 'number' && typeof food.y === 'number') {
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
  }
  
  // Draw snake - use a simpler rendering method for better performance
  if (snake && snake.length > 0) {
    const head = snake[0];
    const body = snake.slice(1);
    
    // Draw head
    ctx.fillStyle = '#4ADE80';
    ctx.fillRect(
      head.x * CELL_SIZE,
      head.y * CELL_SIZE,
      CELL_SIZE - 1,
      CELL_SIZE - 1
    );
    
    // Draw body with single color for better performance
    ctx.fillStyle = 'rgba(74, 222, 128, 0.8)';
    for (let i = 0; i < body.length; i++) {
      const segment = body[i];
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
    }
  }
};
