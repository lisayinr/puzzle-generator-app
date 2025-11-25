import "./SudokuGrid.css";
import { useState, useEffect } from "react";
import { generateSudoku } from "../utils/sudokuGenerator";

function SudokuGrid({ onBack }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [puzzleData, setPuzzleData] = useState(generateSudoku({ blanks: 38 }));
  const [grid, setGrid] = useState(puzzleData.puzzle);
  const [solution, setSolution] = useState(puzzleData.solution);

  const [activeCell, setActiveCell] = useState(null);

  /* -------------------- TIMER -------------------- */
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = () => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ------------------ DIFFICULTY CHANGE ------------------ */
  useEffect(() => {
    const blanks =
      difficulty === "easy" ? 38 :
      difficulty === "medium" ? 46 :
      54;

    const newData = generateSudoku({ blanks });
    setPuzzleData(newData);
    setGrid(newData.puzzle);
    setSolution(newData.solution);

    setTime(0);
    setIsRunning(true);
    setActiveCell(null);
  }, [difficulty]);

  /* ------------------ NEW PUZZLE ------------------ */
  const loadNewPuzzle = () => {
    const blanks =
      difficulty === "easy" ? 38 :
      difficulty === "medium" ? 46 :
      54;

    const newData = generateSudoku({ blanks });
    setPuzzleData(newData);
    setGrid(newData.puzzle);
    setSolution(newData.solution);

    setTime(0);
    setIsRunning(true);
    setActiveCell(null);
  };

  /* ------------------ RESET PUZZLE ------------------ */
  const resetPuzzle = () => {
    setGrid(puzzleData.puzzle.map((row) => [...row]));
    setTime(0);
    setIsRunning(true);
    setActiveCell(null);
  };

  /* ------------------ CHECK ANSWER ------------------ */
  const checkAnswer = () => {
    if (JSON.stringify(grid) === JSON.stringify(solution)) {
      setIsRunning(false);
      alert(`✅ Correct!\nTime: ${formatTime()}`);
    } else {
      alert("❌ Not quite, keep trying!");
    }
  };

  /* ------------------ HINT SYSTEM ------------------ */
  const giveHint = () => {
    const blanks = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (puzzleData.puzzle[r][c] === 0 && grid[r][c] === 0) {
          blanks.push({ r, c });
        }
      }
    }

    if (blanks.length === 0) {
      alert("🎉 No blanks left to fill!");
      return;
    }

    const randomSpot = blanks[Math.floor(Math.random() * blanks.length)];
    const { r, c } = randomSpot;

    const correctValue = solution[r][c];

    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = correctValue;
    setGrid(newGrid);
  };

  /* ------------------ NUMBER PAD APPLY ------------------ */
  const applyNumber = (num) => {
    if (!activeCell) return;

    const { row, col } = activeCell;

    if (puzzleData.puzzle[row][col] !== 0) return;

    const newGrid = grid.map((r, rIndex) =>
      r.map((c, cIndex) =>
        rIndex === row && cIndex === col ? num : c
      )
    );

    setGrid(newGrid);
  };

  return (
    <div className="app-container">
      <div className="header-bar">
        <h1 className="logo">Puzzle Generator</h1>
        <h2 className="sub-title">Sudoku</h2>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontSize: "1.2rem",
          fontWeight: "600",
        }}
      >
        Time: {formatTime()}
      </div>

      <div className="sudoku-layout">
        <div className="button-column">
          <button className="back-button" onClick={onBack}>Back</button>

          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button onClick={loadNewPuzzle}>New Puzzle</button>
          <button onClick={giveHint}>Hint</button>
          <button onClick={resetPuzzle}>Reset Puzzle</button>
          <button onClick={checkAnswer}>Check Answer</button>
        </div>

        <div className="sudoku-main">
          <div className="sudoku-grid">
            <table>
              <tbody>
                {grid.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex}>
                        {puzzleData.puzzle[rowIndex][colIndex] !== 0 ? (
                          <input value={cell} readOnly />
                        ) : (
                          <input
                            value={cell === 0 ? "" : cell}
                            onClick={() =>
                              setActiveCell({ row: rowIndex, col: colIndex })
                            }
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;

                              const newGrid = grid.map((r, i) =>
                                r.map((c, j) =>
                                  i === rowIndex && j === colIndex ? val : c
                                )
                              );

                              setGrid(newGrid);
                            }}
                            className={[
                              grid[rowIndex][colIndex] !== 0 &&
                              grid[rowIndex][colIndex] !== solution[rowIndex][colIndex]
                                ? "wrong"
                                : "",
                              activeCell &&
                              activeCell.row === rowIndex &&
                              activeCell.col === colIndex
                                ? "active-cell"
                                : ""
                            ]
                              .join(" ")
                              .trim()}
                            inputMode="numeric"
                            pattern="[1-9]*"
                            maxLength={1}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button key={num} onClick={() => applyNumber(num)}>
                {num}
              </button>
            ))}

            <button
              className="erase-button"
              onClick={() => applyNumber(0)}
            >
              Erase
            </button>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>Puzzle Generator © 2025 | Created by Lisa Yin</p>
      </footer>
    </div>
  );
}

export default SudokuGrid;
