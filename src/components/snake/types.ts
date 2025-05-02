
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type Coordinate = {
  x: number;
  y: number;
};

// Game constants
export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const GAME_SPEED = 150;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];
