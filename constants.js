// constants.js

// Получаем размер экрана
export const WIDTH = window.innerWidth;
export const HEIGHT = window.innerHeight;

// Определяем размеры сетки
export const GRID_COLUMNS = 10;
export const GRID_ROWS = 20;

// Задаём процент экрана, который займёт сетка
export const GRID_SCREEN_WIDTH_RATIO = 0.6; // 60% ширины экрана
export const GRID_SCREEN_HEIGHT_RATIO = 0.9; // 90% высоты экрана

// Вычисляем размер блока так, чтобы сетка умещалась в заданные проценты экрана
export const BLOCK_SIZE = Math.min(
  (WIDTH * GRID_SCREEN_WIDTH_RATIO) / GRID_COLUMNS,
  (HEIGHT * GRID_SCREEN_HEIGHT_RATIO) / GRID_ROWS
);

// Теперь определяем реальные размеры сетки
export const GRID_WIDTH = BLOCK_SIZE * GRID_COLUMNS;
export const GRID_HEIGHT = BLOCK_SIZE * GRID_ROWS;

// Позиционируем сетку с отступом слева
export const GRID_X_OFFSET = 20; // Отступ слева
export const GRID_Y_OFFSET = (HEIGHT - GRID_HEIGHT) / 2;

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
