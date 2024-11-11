// utils.js

import { WIDTH, HEIGHT, GRID_WIDTH, GRID_HEIGHT, BLOCK_SIZE, COLORS } from './constants.js';

// Определяем смещения для сетки
export const GRID_X_OFFSET = (WIDTH - GRID_WIDTH) / 2;
export const GRID_Y_OFFSET = (HEIGHT - GRID_HEIGHT) / 2;

// Функция для отрисовки сетки
export function drawGrid(context, grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      context.fillStyle = grid[y][x];
      context.fillRect(
        GRID_X_OFFSET + x * BLOCK_SIZE,
        GRID_Y_OFFSET + y * BLOCK_SIZE,
        BLOCK_SIZE,
        BLOCK_SIZE
      );
      context.strokeStyle = COLORS.WHITE;
      context.strokeRect(
        GRID_X_OFFSET + x * BLOCK_SIZE,
        GRID_Y_OFFSET + y * BLOCK_SIZE,
        BLOCK_SIZE,
        BLOCK_SIZE
      );
    }
  }
}

// Функция для отрисовки фигуры
export function drawShape(context, shape, color, offsetX, offsetY) {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        context.fillStyle = color;
        context.fillRect(
          GRID_X_OFFSET + (offsetX + x) * BLOCK_SIZE,
          GRID_Y_OFFSET + (offsetY + y) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
        context.strokeStyle = COLORS.WHITE;
        context.strokeRect(
          GRID_X_OFFSET + (offsetX + x) * BLOCK_SIZE,
          GRID_Y_OFFSET + (offsetY + y) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }
  }
}

// Функция для отрисовки следующей фигуры и информации
export function drawNextShape(context, shape, color, score, autoPlay, level) {
  const nextBoxWidth = GRID_WIDTH * 0.4;
  const nextBoxHeight = nextBoxWidth;
  const nextBoxX = GRID_X_OFFSET + GRID_WIDTH + 20;
  const nextBoxY = GRID_Y_OFFSET;

  context.strokeStyle = COLORS.WHITE;
  context.strokeRect(nextBoxX, nextBoxY, nextBoxWidth, nextBoxHeight);

  // Отрисовка заголовка "NEXT"
  context.font = `${BLOCK_SIZE}px Comic Sans MS`;
  context.fillStyle = COLORS.WHITE;
  context.textAlign = 'center';
  context.fillText('NEXT', nextBoxX + nextBoxWidth / 2, nextBoxY - 10);

  // Отрисовка следующей фигуры
  const shapeScale = BLOCK_SIZE * 0.8;
  const offsetX = (nextBoxWidth - shape[0].length * shapeScale) / 2;
  const offsetY = (nextBoxHeight - shape.length * shapeScale) / 2;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        context.fillStyle = color;
        context.fillRect(
          nextBoxX + offsetX + x * shapeScale,
          nextBoxY + offsetY + y * shapeScale,
          shapeScale,
          shapeScale
        );
        context.strokeStyle = COLORS.WHITE;
        context.strokeRect(
          nextBoxX + offsetX + x * shapeScale,
          nextBoxY + offsetY + y * shapeScale,
          shapeScale,
          shapeScale
        );
      }
    }
  }

  // Отображение очков и уровня
  context.fillStyle = COLORS.WHITE;
  context.textAlign = 'left';
  context.font = `${BLOCK_SIZE * 0.8}px Comic Sans MS`;
  context.fillText(`SCORE: ${score}`, nextBoxX, nextBoxY + nextBoxHeight + 40);
  context.fillText(`LEVEL: ${level}`, nextBoxX, nextBoxY + nextBoxHeight + 80);

  // Отображение статуса "Auto Play"
  const autoPlayText = 'Auto Play';
  context.fillStyle = autoPlay ? COLORS.GREEN : COLORS.RED;
  context.fillText(autoPlayText, nextBoxX, nextBoxY + nextBoxHeight + 120);

  // Сохранение области текста для клика
  const autoPlayMetrics = context.measureText(autoPlayText);
  const autoPlayRect = {
    x: nextBoxX,
    y: nextBoxY + nextBoxHeight + 100,
    width: autoPlayMetrics.width,
    height: BLOCK_SIZE,
  };

  return autoPlayRect;
}

// Функция для отрисовки кнопки паузы
export function drawPauseButton(context) {
  context.font = `${BLOCK_SIZE}px Comic Sans MS`;
  context.fillStyle = COLORS.WHITE;
  const pauseText = 'Pause';
  const pauseMetrics = context.measureText(pauseText);
  const pauseX = WIDTH - pauseMetrics.width - 20;
  const pauseY = GRID_Y_OFFSET + 30;
  context.fillText(pauseText, pauseX, pauseY);

  const pauseRect = {
    x: pauseX,
    y: pauseY - BLOCK_SIZE,
    width: pauseMetrics.width,
    height: BLOCK_SIZE,
  };

  return pauseRect;
}

// Функция для отрисовки главного меню
export function drawMenu(context) {
  context.fillStyle = COLORS.BLACK;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.font = `${BLOCK_SIZE * 1.5}px Comic Sans MS`;
  context.fillStyle = COLORS.WHITE;
  context.textAlign = 'center';

  context.fillText('Tetris The Game', WIDTH / 2, HEIGHT / 4);

  context.fillStyle = COLORS.GREEN;

  const arcadeText = 'Arcade Mode';
  const endlessText = 'Endless Mode';
  const settingsText = 'Settings';

  const arcadeY = HEIGHT / 2 - 50;
  const endlessY = HEIGHT / 2;
  const settingsY = HEIGHT / 2 + 50;

  context.fillText(arcadeText, WIDTH / 2, arcadeY);
  context.fillText(endlessText, WIDTH / 2, endlessY);
  context.fillText(settingsText, WIDTH / 2, settingsY);

  // Сохранение областей текста для кликов
  const arcadeMetrics = context.measureText(arcadeText);
  const endlessMetrics = context.measureText(endlessText);
  const settingsMetrics = context.measureText(settingsText);

  const arcadeRect = {
    x: WIDTH / 2 - arcadeMetrics.width / 2,
    y: arcadeY - BLOCK_SIZE,
    width: arcadeMetrics.width,
    height: BLOCK_SIZE * 1.2,
  };
  const endlessRect = {
    x: WIDTH / 2 - endlessMetrics.width / 2,
    y: endlessY - BLOCK_SIZE,
    width: endlessMetrics.width,
    height: BLOCK_SIZE * 1.2,
  };
  const settingsRect = {
    x: WIDTH / 2 - settingsMetrics.width / 2,
    y: settingsY - BLOCK_SIZE,
    width: settingsMetrics.width,
    height: BLOCK_SIZE * 1.2,
  };

  return { arcadeRect, endlessRect, settingsRect };
}

// Функция для отрисовки экрана "Game Over"
export function drawGameOver(context, score, bestScore) {
  context.fillStyle = COLORS.BLACK;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.font = `${BLOCK_SIZE * 1.5}px Comic Sans MS`;
  context.fillStyle = COLORS.WHITE;
  context.textAlign = 'center';

  context.fillText('Game Over', WIDTH / 2, HEIGHT / 2 - 80);
  context.fillText(`Score: ${score}`, WIDTH / 2, HEIGHT / 2 - 30);
  context.fillText(`Best Score: ${bestScore}`, WIDTH / 2, HEIGHT / 2 + 20);

  context.fillStyle = COLORS.GREEN;
  const tryAgainText = 'Try Again';
  context.fillText(tryAgainText, WIDTH / 2, HEIGHT / 2 + 80);

  const tryAgainMetrics = context.measureText(tryAgainText);
  const tryAgainRect = {
    x: WIDTH / 2 - tryAgainMetrics.width / 2,
    y: HEIGHT / 2 + 80 - BLOCK_SIZE,
    width: tryAgainMetrics.width,
    height: BLOCK_SIZE * 1.2,
  };

  return { tryAgainRect };
}

// Функция для отрисовки меню паузы
export function drawPauseMenu(context) {
  context.fillStyle = 'rgba(0, 0, 0, 0.8)';
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.font = `${BLOCK_SIZE * 1.2}px Comic Sans MS`;
  context.fillStyle = COLORS.WHITE;
  context.textAlign = 'center';

  const resumeText = 'Resume';
  const exitText = 'Exit';

  const resumeY = HEIGHT / 2 - 30;
  const exitY = HEIGHT / 2 + 30;

  context.fillText(resumeText, WIDTH / 2, resumeY);
  context.fillText(exitText, WIDTH / 2, exitY);

  const resumeMetrics = context.measureText(resumeText);
  const exitMetrics = context.measureText(exitText);

  const resumeRect = {
    x: WIDTH / 2 - resumeMetrics.width / 2,
    y: resumeY - BLOCK_SIZE,
    width: resumeMetrics.width,
    height: BLOCK_SIZE * 1.2,
  };
  const exitRect = {
    x: WIDTH / 2 - exitMetrics.width / 2,
    y: exitY - BLOCK_SIZE,
    width: exitMetrics.width,
    height: BLOCK_SIZE * 1.2,
  };

  return { resumeRect, exitRect };
}

// Функция для отрисовки меню настроек
export function drawSettingsMenu(context, softGuaranteeEnabled) {
  context.fillStyle = COLORS.BLACK;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.font = `${BLOCK_SIZE * 1.2}px Comic Sans MS`;
  context.fillStyle = softGuaranteeEnabled ? COLORS.GREEN : COLORS.RED;
  context.textAlign = 'center';

  const softText = `SOFT GUARANTEE: ${softGuaranteeEnabled ? 'ON' : 'OFF'}`;
  const returnText = 'Return';

  const softY = HEIGHT / 2 - 30;
  const returnY = HEIGHT / 2 + 30;

  context.fillText(softText, WIDTH / 2, softY);
  context.fillStyle = COLORS.GREEN;
  context.fillText(returnText, WIDTH / 2, returnY);

  const softMetrics = context.measureText(softText);
  const returnMetrics = context.measureText(returnText);

  const softGuaranteeRect = {
    x: WIDTH / 2 - softMetrics.width / 2,
    y: softY - BLOCK_SIZE,
    width: softMetrics.width,
    height: BLOCK_SIZE * 1.2,
  };
  const returnRect = {
    x: WIDTH / 2 - returnMetrics.width / 2,
    y: returnY - BLOCK_SIZE,
    width: returnMetrics.width,
    height: BLOCK_SIZE * 1.2,
  };

  return { softGuaranteeRect, returnRect };
}

// Функция для поворота матрицы (фигуры)
export function rotateMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated = [];
  for (let x = 0; x < cols; x++) {
    rotated[x] = [];
    for (let y = rows - 1; y >= 0; y--) {
      rotated[x][rows - y - 1] = matrix[y][x];
    }
  }
  return rotated;
}

// Функция для проверки столкновений
export function checkCollision(grid, shape, offsetX, offsetY) {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = offsetX + x;
        const newY = offsetY + y;
        if (
          newX < 0 ||
          newX >= grid[0].length ||
          newY >= grid.length ||
          (newY >= 0 && grid[newY][newX] !== COLORS.BLACK)
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

// Функция для слияния фигуры с сеткой
export function mergeShape(grid, shape, offsetX, offsetY, color) {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = offsetX + x;
        const newY = offsetY + y;
        if (newY >= 0 && newY < grid.length && newX >= 0 && newX < grid[0].length) {
          grid[newY][newX] = color;
        }
      }
    }
  }
}

// Функция для очистки полных линий
export function clearLines(grid) {
  let linesCleared = 0;
  outer: for (let y = grid.length - 1; y >= 0; y--) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === COLORS.BLACK) {
        continue outer;
      }
    }
    // Удаляем полную линию
    grid.splice(y, 1);
    // Добавляем новую пустую линию сверху
    grid.unshift(Array(grid[0].length).fill(COLORS.BLACK));
    linesCleared++;
    y++; // Проверяем ту же строку снова, так как она сдвинулась вниз
  }
  return linesCleared;
}

// Функции для автоигры

// Функция для оценки состояния доски
export function evaluateBoard(grid) {
  let aggregateHeight = 0;
  let completeLines = 0;
  let holes = 0;
  let bumpiness = 0;
  let maxHeight = 0;
  let wells = 0;
  let heights = [];
  let centralityPenalty = 0;

  const width = grid[0].length;
  const center = width / 2;

  for (let x = 0; x < width; x++) {
    let columnHeight = 0;
    let blockFound = false;
    let columnHoles = 0;
    for (let y = 0; y < grid.length; y++) {
      if (grid[y][x] !== COLORS.BLACK) {
        if (!blockFound) {
          columnHeight = grid.length - y;
          blockFound = true;
          heights.push(columnHeight);
          const distanceFromCenter = Math.abs(x - center + 0.5);
          const normalizedDistance = distanceFromCenter / center;
          centralityPenalty += columnHeight * (1 - normalizedDistance);
        }
      } else if (blockFound) {
        columnHoles++;
      }
    }
    aggregateHeight += columnHeight;
    holes += columnHoles;
    maxHeight = Math.max(maxHeight, columnHeight);
  }

  for (let i = 0; i < heights.length - 1; i++) {
    bumpiness += Math.abs(heights[i] - heights[i + 1]);
  }

  // Вычисление колодцев
  for (let x = 0; x < width; x++) {
    let wellDepth = 0;
    for (let y = 0; y < grid.length; y++) {
      if (grid[y][x] === COLORS.BLACK) {
        if (
          (x === 0 || grid[y][x - 1] !== COLORS.BLACK) &&
          (x === width - 1 || grid[y][x + 1] !== COLORS.BLACK)
        ) {
          wellDepth++;
        }
      } else {
        if (wellDepth > 0) {
          wells += (wellDepth * (wellDepth + 1)) / 2;
          wellDepth = 0;
        }
      }
    }
    if (wellDepth > 0) {
      wells += (wellDepth * (wellDepth + 1)) / 2;
    }
  }

  // Подсчёт полных линий
  for (let row of grid) {
    if (row.every(cell => cell !== COLORS.BLACK)) {
      completeLines++;
    }
  }

  // Весовая оценка
  const score =
    aggregateHeight * 0.5 +
    holes * 7.0 +
    bumpiness * 0.5 +
    maxHeight * 1.0 +
    wells * 3.0 +
    centralityPenalty * 0.5 -
    completeLines * 4.0;

  return score;
}

// Функция для получения всех уникальных поворотов фигуры
export function getRotations(shape) {
  const rotations = [];
  let currentShape = shape;
  for (let i = 0; i < 4; i++) {
    currentShape = rotateMatrix(currentShape);
    if (!rotations.some(rot => JSON.stringify(rot) === JSON.stringify(currentShape))) {
      rotations.push(currentShape);
    }
  }
  return rotations;
}

// Функция для поиска лучшего хода для автоигры
export function findBestMove(grid, shape, color) {
  let bestScore = Infinity;
  let bestX = 0;
  let bestRotation = shape;
  const rotations = getRotations(shape);

  for (let rotation of rotations) {
    const minX =
      -Math.min(
        ...rotation.map((row, y) =>
          row.map((cell, x) => (cell ? x : Infinity)).filter(val => val !== Infinity)
        ).flat()
      );
    const maxX =
      grid[0].length -
      Math.max(
        ...rotation.map((row, y) =>
          row.map((cell, x) => (cell ? x : -Infinity)).filter(val => val !== -Infinity)
        ).flat()
      );

    for (let x = minX; x < maxX; x++) {
      let y = 0;
      while (!checkCollision(grid, rotation, x, y)) {
        y++;
      }
      y--;
      if (y < 0) {
        continue;
      }

      const tempGrid = grid.map(row => [...row]);
      mergeShape(tempGrid, rotation, x, y, color);
      clearLines(tempGrid);
      const score = evaluateBoard(tempGrid);

      if (score < bestScore) {
        bestScore = score;
        bestX = x;
        bestRotation = rotation;
      }
    }
  }

  return { bestX, bestRotation };
}
