import "./SudokuGrid.css";
import { useState, useEffect } from "react";
import { generateSudoku } from "../utils/sudokuGenerator";

function SudokuGrid({ onBack }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [puzzleData, setPuzzleData] = useState(generateSudoku({ blanks: 38 }));
  const [grid, setGrid] = useState(puzzleData.puzzle);
  const [solution, setSolution] = useState(puzzleData.solution);

  // 🔄 Auto-generate whenever difficulty changes
  useEffect(() => {
    const blanks =
      difficulty === "easy" ? 38 :
      difficulty === "medium" ? 46 :
      54; // hard

    const newData = generateSudoku({ blanks });
    setPuzzleData(newData);
    setGrid(newData.puzzle);
    setSolution(newData.solution);
  }, [difficulty]);

  // 🧩 New Puzzle
  const loadNewPuzzle = () => {
    const blanks =
      difficulty === "easy" ? 38 :
      difficulty === "medium" ? 46 :
      54; // hard
    const newData = generateSudoku({ blanks });
    setPuzzleData(newData);
    setGrid(newData.puzzle);
    setSolution(newData.solution);
  };

  // 🔁 Reset Puzzle
  const resetPuzzle = () => {
    setGrid(puzzleData.puzzle.map((row) => [...row]));
  };

  // ✅ Check Answer
  const checkAnswer = () => {
    if (JSON.stringify(grid) === JSON.stringify(solution)) {
      alert("✅ Correct! Well done!");
    } else {
      alert("❌ Not quite, keep trying!");
    }
  };

  return (
    <div className="app-container">
      {/* Header Bar */}
      <div className="header-bar">
        <h1 className="logo">Puzzle Generator</h1>
        <h2 className="sub-title">
          Sudoku Puzzle — <span style={{ textTransform: "capitalize" }}>{difficulty}</span>
        </h2>
      </div>

      {/* Layout */}
      <div className="sudoku-layout">
        {/* Button Column */}
        <div className="button-column">
          <button className="back-button" onClick={onBack}>
            Back
          </button>

          {/* Difficulty Dropdown */}
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
          <button onClick={resetPuzzle}>Reset Puzzle</button>
          <button onClick={checkAnswer}>Check Answer</button>
        </div>

        {/* Sudoku Grid */}
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
                          onChange={(e) => {
                            const newGrid = grid.map((r, i) =>
                              r.map((c, j) =>
                                i === rowIndex && j === colIndex
                                  ? Number(e.target.value) || 0
                                  : c
                              )
                            );
                            setGrid(newGrid);
                          }}
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
      </div>
    </div>
  );
}

export default SudokuGrid;

