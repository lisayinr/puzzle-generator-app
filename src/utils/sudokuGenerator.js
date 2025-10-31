function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function deepCopy(grid) {
  return grid.map((row) => row.slice());
}

function isValid(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }
  const r0 = Math.floor(row / 3) * 3;
  const c0 = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[r0 + r][c0 + c] === num) return false;
    }
  }
  return true;
}

function candidates(grid, row, col) {
  const taken = new Set();
  for (let i = 0; i < 9; i++) {
    if (grid[row][i]) taken.add(grid[row][i]);
    if (grid[i][col]) taken.add(grid[i][col]);
  }
  const r0 = Math.floor(row / 3) * 3;
  const c0 = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[r0 + r][c0 + c]) taken.add(grid[r0 + r][c0 + c]);
    }
  }
  const nums = [];
  for (let n = 1; n <= 9; n++) if (!taken.has(n)) nums.push(n);
  return nums;
}

function findBestEmpty(grid) {
  let best = null;
  let bestLen = 10;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        const cs = candidates(grid, r, c);
        if (cs.length < bestLen) {
          bestLen = cs.length;
          best = { r, c, cs };
          if (bestLen === 1) return best;
        }
      }
    }
  }
  return best;
}

function fillGrid(grid) {
  const spot = findBestEmpty(grid);
  if (!spot) return true;
  const { r, c } = spot;
  const nums = shuffleInPlace(spot.cs.slice());
  for (const n of nums) {
    if (isValid(grid, r, c, n)) {
      grid[r][c] = n;
      if (fillGrid(grid)) return true;
      grid[r][c] = 0;
    }
  }
  return false;
}

function countSolutions(grid, limit = 2) {
  let solutions = 0;
  function backtrack() {
    if (solutions >= limit) return;
    const spot = findBestEmpty(grid);
    if (!spot) {
      solutions += 1;
      return;
    }
    const { r, c, cs } = spot;
    const order = shuffleInPlace(cs.slice());
    for (const n of order) {
      if (isValid(grid, r, c, n)) {
        grid[r][c] = n;
        backtrack();
        if (solutions >= limit) break;
        grid[r][c] = 0;
      }
    }
  }
  backtrack();
  return solutions;
}

function digUnique(startGrid, targetBlanks = 38, useSymmetry = false) {
  const puzzle = deepCopy(startGrid);
  const cells = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) cells.push([r, c]);
  shuffleInPlace(cells);

  const pairs = [];
  const seen = new Set();
  for (const [r, c] of cells) {
    const key = r * 9 + c;
    if (seen.has(key)) continue;
    const rr = 8 - r, cc = 8 - c;
    const key2 = rr * 9 + cc;
    seen.add(key);
    seen.add(key2);
    if (useSymmetry && key !== key2) pairs.push([[r, c], [rr, cc]]);
    else pairs.push([[r, c]]);
  }

  let blanks = 0;
  for (const pair of pairs) {
    if (blanks >= targetBlanks) break;
    const old = [];
    let changed = 0;
    for (const [r, c] of pair) {
      if (puzzle[r][c] !== 0) {
        old.push([r, c, puzzle[r][c]]);
        puzzle[r][c] = 0;
        changed++;
      }
    }
    if (changed === 0) continue;

    const test = deepCopy(puzzle);
    const sols = countSolutions(test, 2);
    if (sols === 1) {
      blanks += changed;
    } else {
      for (const [r, c, v] of old) puzzle[r][c] = v;
    }
  }

  return puzzle;
}

// Main generator
export function generateSudoku(options = {}) {
  const blanks = Math.max(0, Math.min(64, options.blanks ?? 38));
  const symmetry = !!options.symmetry;

  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  if (!fillGrid(grid)) throw new Error("Failed to generate a full solution.");

  const solution = deepCopy(grid);
  const puzzle = digUnique(solution, blanks, symmetry);

  const check = deepCopy(puzzle);
  if (countSolutions(check, 2) !== 1) {
    throw new Error("Uniqueness check failed unexpectedly.");
  }

  return { puzzle, solution };
}



