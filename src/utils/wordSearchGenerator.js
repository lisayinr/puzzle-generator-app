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

function placeWord(grid, word) {
  const size = grid.length;

  const directions = [
    [1, 0],   // down
    [0, 1],   // right
    [1, 1],   // down-right diagonal
    [-1, 1],  // up-right diagonal
  ];

  const dirs = [...directions].sort(() => Math.random() - 0.5);

  for (const [dr, dc] of dirs) {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        let fits = true;

        for (let i = 0; i < word.length; i++) {
          const rr = r + dr * i;
          const cc = c + dc * i;

          if (rr < 0 || rr >= size || cc < 0 || cc >= size) {
            fits = false;
            break;
          }

          const cell = grid[rr][cc];
          if (cell !== "" && cell !== word[i]) {
            fits = false;
            break;
          }
        }

        if (fits) {
          for (let i = 0; i < word.length; i++) {
            const rr = r + dr * i;
            const cc = c + dc * i;
            grid[rr][cc] = word[i];
          }
          return true;
        }
      }
    }
  }

  return false;
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

  // FINAL WORD LIST (only includes placed words)
  const chosenWords = getRandomWords(wordCount);
  const placedWords = [];

  for (const word of chosenWords) {
    const upperWord = word.toUpperCase();
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 50) {
      placed = placeWord(grid, upperWord);
      attempts++;
    }

    // Only keep words that were actually placed
    if (placed) placedWords.push(upperWord);
  }

  fillRandomLetters(grid);

  return { grid, words: placedWords };
}
