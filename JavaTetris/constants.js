// constants.js

// Размеры экрана
export const WIDTH = 500;
export const HEIGHT = 600;
export const GRID_WIDTH = 300;
export const GRID_HEIGHT = 600;
export const BLOCK_SIZE = 30;

// Цвета
export const COLORS = {
  BLACK: 'rgb(0, 0, 0)',
  WHITE: 'rgb(255, 255, 255)',
  GRAY: 'rgb(128, 128, 128)',
  RED: 'rgb(255, 0, 0)',
  GREEN: 'rgb(0, 255, 0)',
  BLUE: 'rgb(0, 0, 255)',
  YELLOW: 'rgb(255, 255, 0)',
  CYAN: 'rgb(0, 255, 255)',
  MAGENTA: 'rgb(255, 0, 255)',
  ORANGE: 'rgb(255, 165, 0)',
};

// Массив цветов для случайного выбора (исключая BLACK и WHITE)
export const COLOR_LIST = [
  COLORS.RED,
  COLORS.GREEN,
  COLORS.BLUE,
  COLORS.YELLOW,
  COLORS.CYAN,
  COLORS.MAGENTA,
  COLORS.ORANGE,
];
