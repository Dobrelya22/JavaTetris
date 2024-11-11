// main.js

import { WIDTH, HEIGHT, GRID_WIDTH, GRID_HEIGHT, BLOCK_SIZE, COLORS, COLOR_LIST } from './constants.js';
import { SHAPES } from './shapes.js';
import {
  drawGrid,
  drawShape,
  drawNextShape,
  checkCollision,
  mergeShape,
  clearLines,
  drawMenu,
  drawGameOver,
  drawControls,
  drawPauseButton,
  drawPauseMenu,
  drawSettingsMenu,
  rotateMatrix,
  evaluateBoard,
  getRotations,
  findBestMove,
} from './utils.js';

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT + 250; // Увеличиваем высоту для размещения кнопок управления

let grid;
let currentShape;
let nextShape;
let currentX;
let currentY;
let score;
let bestScore = 0;
let menu = true;
let gameOver = false;
let paused = false;
let settingsMenu = false;
let autoPlay = false;
let gameMode = null;
let level = 1;
let linesClearedTotal = 0;
let softGuaranteeEnabled = false;
let iPieceCounter = 0;
let lastFallTime = Date.now();
let fallSpeed = 500; // Миллисекунды между падениями

// Добавляем переменные для автоигры
let autoMoveSteps = [];
let autoLastMoveTime = Date.now();
let autoMoveDelay = 50; // Задержка между автоматическими перемещениями (мс)

// Переменные для сенсорного управления
let isTouchingPiece = false;
let touchStartX = 0;
let touchStartY = 0;
let lastTouchX = 0;
let lastTouchY = 0;
let touchStartTime = 0;

resetGameVariables();

function resetGameVariables() {
  grid = Array.from({ length: GRID_HEIGHT / BLOCK_SIZE }, () =>
    Array(GRID_WIDTH / BLOCK_SIZE).fill(COLORS.BLACK)
  );
  currentShape = getNextShape();
  nextShape = getNextShape();
  currentX = Math.floor((GRID_WIDTH / BLOCK_SIZE) / 2) - Math.floor(currentShape.shape[0].length / 2);
  currentY = 0;
  score = 0;
  level = 1;
  linesClearedTotal = 0;
  fallSpeed = 500;
  iPieceCounter = 0;
  autoMoveSteps = [];
}

function getNextShape() {
  if (softGuaranteeEnabled) {
    let iPieceProbability = Math.min(1.0, 0.05 * Math.pow(2, iPieceCounter));
    if (Math.random() < iPieceProbability) {
      iPieceCounter = 0;
      return { shape: SHAPES[0], color: getRandomColor() }; // Фигура I
    } else {
      iPieceCounter++;
      const shape = SHAPES.slice(1)[Math.floor(Math.random() * (SHAPES.length - 1))];
      return { shape, color: getRandomColor() };
    }
  } else {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    if (shape === SHAPES[0]) {
      iPieceCounter = 0;
    } else {
      iPieceCounter++;
    }
    return { shape, color: getRandomColor() };
  }
}

function getRandomColor() {
  return COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)];
}

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
document.addEventListener('keydown', handleKeyDown);

function handleMouseDown(event) {
  const { offsetX: mouseX, offsetY: mouseY } = event;
  if (menu) {
    handleMenuClick(mouseX, mouseY);
  } else if (settingsMenu) {
    handleSettingsClick(mouseX, mouseY);
  } else if (paused) {
    handlePauseClick(mouseX, mouseY);
  } else if (gameOver) {
    handleGameOverClick(mouseX, mouseY);
  } else {
    handleGameClick(mouseX, mouseY);
  }
}

function handleMenuClick(mouseX, mouseY) {
  const { arcadeRect, endlessRect, settingsRect } = drawMenu(context);
  if (isPointInRect(mouseX, mouseY, arcadeRect)) {
    gameMode = 'Arcade';
    menu = false;
    resetGameVariables();
  } else if (isPointInRect(mouseX, mouseY, endlessRect)) {
    gameMode = 'Endless';
    menu = false;
    resetGameVariables();
  } else if (isPointInRect(mouseX, mouseY, settingsRect)) {
    settingsMenu = true;
    menu = false;
  }
}

function handleSettingsClick(mouseX, mouseY) {
  const { softGuaranteeRect, returnRect } = drawSettingsMenu(context, softGuaranteeEnabled);
  if (isPointInRect(mouseX, mouseY, softGuaranteeRect)) {
    softGuaranteeEnabled = !softGuaranteeEnabled;
  } else if (isPointInRect(mouseX, mouseY, returnRect)) {
    settingsMenu = false;
    menu = true;
  }
}

function handlePauseClick(mouseX, mouseY) {
  const { resumeRect, exitRect } = drawPauseMenu(context);
  if (isPointInRect(mouseX, mouseY, resumeRect)) {
    paused = false;
  } else if (isPointInRect(mouseX, mouseY, exitRect)) {
    menu = true;
    paused = false;
    gameOver = false;
  }
}

function handleGameOverClick(mouseX, mouseY) {
  const { tryAgainRect } = drawGameOver(context, score, bestScore);
  if (isPointInRect(mouseX, mouseY, tryAgainRect)) {
    menu = true;
    gameOver = false;
  }
}

function handleGameClick(mouseX, mouseY) {
  const pauseRect = drawPauseButton(context);
  const { leftArrowRect, rotateArrowRect, rightArrowRect, downArrowRect } = drawControls(context);
  const autoPlayRect = drawNextShape(context, nextShape.shape, nextShape.color, score, autoPlay, level);

  if (isPointInRect(mouseX, mouseY, pauseRect)) {
    paused = true;
  } else if (isPointInRect(mouseX, mouseY, autoPlayRect)) {
    autoPlay = !autoPlay;
  } else if (!autoPlay) {
    if (isPointInRect(mouseX, mouseY, leftArrowRect)) {
      if (!checkCollision(grid, currentShape.shape, currentX - 1, currentY)) {
        currentX--;
      }
    } else if (isPointInRect(mouseX, mouseY, rightArrowRect)) {
      if (!checkCollision(grid, currentShape.shape, currentX + 1, currentY)) {
        currentX++;
      }
    } else if (isPointInRect(mouseX, mouseY, downArrowRect)) {
      if (!checkCollision(grid, currentShape.shape, currentX, currentY + 1)) {
        currentY++;
      }
    } else if (isPointInRect(mouseX, mouseY, rotateArrowRect)) {
      const rotatedShape = rotateMatrix(currentShape.shape);
      if (!checkCollision(grid, rotatedShape, currentX, currentY)) {
        currentShape.shape = rotatedShape;
      }
    }
  }
}

function isPointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

function handleKeyDown(event) {
  if (!autoPlay && !menu && !paused && !gameOver && !settingsMenu) {
    handlePlayerInput(event);
  }
  if (event.key === 'a') {
    autoPlay = !autoPlay;
    autoMoveSteps = []; // Сброс шагов автоигры при переключении
  } else if (event.key === 'p') {
    paused = !paused;
  }
}

function handlePlayerInput(event) {
  switch (event.key) {
    case 'ArrowLeft':
      if (!checkCollision(grid, currentShape.shape, currentX - 1, currentY)) {
        currentX--;
      }
      break;
    case 'ArrowRight':
      if (!checkCollision(grid, currentShape.shape, currentX + 1, currentY)) {
        currentX++;
      }
      break;
    case 'ArrowDown':
      if (!checkCollision(grid, currentShape.shape, currentX, currentY + 1)) {
        currentY++;
      }
      break;
    case 'ArrowUp':
      const rotatedShape = rotateMatrix(currentShape.shape);
      if (!checkCollision(grid, rotatedShape, currentX, currentY)) {
        currentShape.shape = rotatedShape;
      }
      break;
  }
}

// Обработка сенсорных событий
function handleTouchStart(event) {
  event.preventDefault();
  const touch = event.touches[0];
  const touchX = touch.clientX - canvas.getBoundingClientRect().left;
  const touchY = touch.clientY - canvas.getBoundingClientRect().top;

  if (menu || settingsMenu || paused || gameOver) {
    // Если игра в меню, обрабатываем как клик мыши
    handleMouseDown({ offsetX: touchX, offsetY: touchY });
  } else {
    if (isTouchOnPiece(touchX, touchY)) {
      isTouchingPiece = true;
      touchStartX = touchX;
      touchStartY = touchY;
      lastTouchX = touchX;
      lastTouchY = touchY;
      touchStartTime = event.timeStamp;
    }
  }
}

function handleTouchMove(event) {
  event.preventDefault();
  if (isTouchingPiece && !autoPlay) {
    const touch = event.touches[0];
    const touchX = touch.clientX - canvas.getBoundingClientRect().left;
    const deltaX = touchX - lastTouchX;

    if (deltaX > BLOCK_SIZE) {
      // Двигаем фигуру вправо
      if (!checkCollision(grid, currentShape.shape, currentX + 1, currentY)) {
        currentX++;
      }
      lastTouchX = touchX;
    } else if (deltaX < -BLOCK_SIZE) {
      // Двигаем фигуру влево
      if (!checkCollision(grid, currentShape.shape, currentX - 1, currentY)) {
        currentX--;
      }
      lastTouchX = touchX;
    }
  }
}

function handleTouchEnd(event) {
  event.preventDefault();
  if (isTouchingPiece) {
    const touchDuration = event.timeStamp - touchStartTime;
    const deltaX = lastTouchX - touchStartX;
    const deltaY = lastTouchY - touchStartY;

    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && touchDuration < 300) {
      // Если касание было коротким и без значительного движения, считаем это нажатием для поворота
      const rotatedShape = rotateMatrix(currentShape.shape);
      if (!checkCollision(grid, rotatedShape, currentX, currentY)) {
        currentShape.shape = rotatedShape;
      }
    }

    isTouchingPiece = false;
  }
}

function isTouchOnPiece(touchX, touchY) {
  const gridX = Math.floor((touchX - 50) / BLOCK_SIZE);
  const gridY = Math.floor(touchY / BLOCK_SIZE);

  for (let y = 0; y < currentShape.shape.length; y++) {
    for (let x = 0; x < currentShape.shape[y].length; x++) {
      if (currentShape.shape[y][x]) {
        if (currentX + x === gridX && currentY + y === gridY) {
          return true;
        }
      }
    }
  }
  return false;
}

function gameLoop() {
  const currentTime = Date.now();

  if (menu) {
    drawMenu(context);
  } else if (settingsMenu) {
    drawSettingsMenu(context, softGuaranteeEnabled);
  } else if (paused) {
    drawPauseMenu(context);
  } else if (gameOver) {
    if (score > bestScore) {
      bestScore = score;
    }
    drawGameOver(context, score, bestScore);
  } else {
    context.fillStyle = COLORS.BLACK;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = COLORS.WHITE;
    context.strokeRect(50, 0, GRID_WIDTH, GRID_HEIGHT);

    drawGrid(context, grid);
    const autoPlayRect = drawNextShape(context, nextShape.shape, nextShape.color, score, autoPlay, level);
    const pauseRect = drawPauseButton(context);
    const { leftArrowRect, rotateArrowRect, rightArrowRect, downArrowRect } = drawControls(context);

    if (autoPlay) {
      // Логика автоигры с имитацией действий игрока
      if (autoMoveSteps.length === 0) {
        // Генерируем последовательность шагов для текущей фигуры
        const { bestX, bestRotation } = findBestMove(grid, currentShape.shape, currentShape.color);
        autoMoveSteps = calculateAutoMoves(currentShape.shape, currentX, bestRotation, bestX);
      }

      // Выполняем шаги автоигры с задержкой
      if (currentTime - autoLastMoveTime > autoMoveDelay && autoMoveSteps.length > 0) {
        const move = autoMoveSteps.shift();
        if (move === 'left' && !checkCollision(grid, currentShape.shape, currentX - 1, currentY)) {
          currentX--;
        } else if (move === 'right' && !checkCollision(grid, currentShape.shape, currentX + 1, currentY)) {
          currentX++;
        } else if (move === 'rotate') {
          const rotatedShape = rotateMatrix(currentShape.shape);
          if (!checkCollision(grid, rotatedShape, currentX, currentY)) {
            currentShape.shape = rotatedShape;
          }
        }
        autoLastMoveTime = currentTime;
      }

      // Фигура падает с обычной скоростью
      if (currentTime - lastFallTime > fallSpeed) {
        if (!checkCollision(grid, currentShape.shape, currentX, currentY + 1)) {
          currentY++;
        } else {
          mergeShape(grid, currentShape.shape, currentX, currentY, currentShape.color);
          const linesCleared = clearLines(grid);
          score += calculateScore(linesCleared);
          linesClearedTotal += linesCleared;
          prepareNextShape();
          autoMoveSteps = []; // Сброс шагов для следующей фигуры
        }
        lastFallTime = currentTime;
      }
    } else {
      // Обычная игровая логика
      if (currentTime - lastFallTime > fallSpeed) {
        if (!checkCollision(grid, currentShape.shape, currentX, currentY + 1)) {
          currentY++;
        } else {
          mergeShape(grid, currentShape.shape, currentX, currentY, currentShape.color);
          const linesCleared = clearLines(grid);
          score += calculateScore(linesCleared);
          linesClearedTotal += linesCleared;
          prepareNextShape();
        }
        lastFallTime = currentTime;
      }
    }

    drawShape(context, currentShape.shape, currentShape.color, currentX, currentY);

    // Обновление уровня и скорости для режима "Arcade"
    if (gameMode === 'Arcade' && linesClearedTotal >= level * 10) {
      level++;
      fallSpeed = Math.max(100, fallSpeed - 50);
    }
  }

  requestAnimationFrame(gameLoop);
}

function calculateScore(linesCleared) {
  switch (linesCleared) {
    case 1:
      return 100;
    case 2:
      return 300;
    case 3:
      return 500;
    case 4:
      return 800;
    default:
      return 0;
  }
}

function prepareNextShape() {
  currentShape = nextShape;
  nextShape = getNextShape();
  currentX = Math.floor((GRID_WIDTH / BLOCK_SIZE) / 2) - Math.floor(currentShape.shape[0].length / 2);
  currentY = 0;
  if (checkCollision(grid, currentShape.shape, currentX, currentY)) {
    gameOver = true;
  }
}

// Функция для вычисления шагов автоигры
function calculateAutoMoves(currentShape, currentX, bestRotation, bestX) {
  const moves = [];
  let tempShape = currentShape;
  // Вычисляем количество поворотов
  let rotationCount = 0;
  while (JSON.stringify(tempShape) !== JSON.stringify(bestRotation) && rotationCount < 4) {
    tempShape = rotateMatrix(tempShape);
    rotationCount++;
    moves.push('rotate');
  }

  // Вычисляем перемещения по X
  const xDifference = bestX - currentX;
  if (xDifference < 0) {
    for (let i = 0; i < Math.abs(xDifference); i++) {
      moves.push('left');
    }
  } else if (xDifference > 0) {
    for (let i = 0; i < xDifference; i++) {
      moves.push('right');
    }
  }

  return moves;
}

gameLoop();


