// constants.js

// Получаем размер экрана
export const WIDTH = window.innerWidth;
export const HEIGHT = window.innerHeight;

// Определяем размеры сетки относительно высоты экрана
export const GRID_HEIGHT = HEIGHT * 0.9; // 90% высоты экрана
export const BLOCK_SIZE = GRID_HEIGHT / 20; // 20 рядов по высоте
export const GRID_WIDTH = BLOCK_SIZE * 10; // 10 колонок по ширине

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
