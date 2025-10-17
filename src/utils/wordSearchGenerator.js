export function generateWordSearch() {
  const size = 10;
  const words = ["CAT", "DOG", "BIRD"];
  const grid = Array.from({ length: size }, () => Array(size).fill(""));

  // place words horizontally for now
  words.forEach(word => {
    const row = Math.floor(Math.random() * size);
    const startCol = Math.floor(Math.random() * (size - word.length));
    for (let i = 0; i < word.length; i++) {
      grid[row][startCol + i] = word[i];
    }
  });

  // fill remaining blanks with random letters
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, words };
}
