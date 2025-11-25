import { WORD_POOL } from "../data/wordlist";

// Pick random words
function getRandomWords(count = 8) {
  const shuffled = [...WORD_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Make empty grid
function createEmptyGrid(size = 12) {
  return Array.from({ length: size }, () => Array(size).fill(""));
}

// Safe word placement
function placeWord(grid, word) {
  const size = grid.length;
  const directions = [
    [1, 0],   // down
    [0, 1],   // right
    [1, 1],   // down-right diagonal
    [-1, 1],  // up-right diagonal
  ];

  const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];

  // Compute legal starting positions
  const rowRange =
    dr === 1 ? size - word.length : dr === -1 ? word.length - 1 : size - 1;
  const colRange = dc === 1 ? size - word.length : size - 1;

  const startRow = Math.floor(Math.random() * (rowRange + 1));
  const startCol = Math.floor(Math.random() * (colRange + 1));

  // Verify placement
  for (let i = 0; i < word.length; i++) {
    const r = startRow + dr * i;
    const c = startCol + dc * i;

    // Out-of-bounds check (prevents undefined errors)
    if (r < 0 || r >= size || c < 0 || c >= size) return false;

    const cell = grid[r][c];
    if (cell !== "" && cell !== word[i]) {
      return false;
    }
  }

  // Place word
  for (let i = 0; i < word.length; i++) {
    const r = startRow + dr * i;
    const c = startCol + dc * i;
    grid[r][c] = word[i];
  }

  return true;
}

// Fill blanks
function fillRandomLetters(grid) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

// Main generator
export function generateWordSearch(size = 12, wordCount = 12) {
  const grid = createEmptyGrid(size);
  const words = getRandomWords(wordCount);

  for (const word of words) {
    let placed = false;
    let attempts = 0;
    const upperWord = word.toUpperCase();

    while (!placed && attempts < 50) {
      placed = placeWord(grid, upperWord);
      attempts++;
    }
  }

  fillRandomLetters(grid);
  return { grid, words };
}

