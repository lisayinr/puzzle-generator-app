import "./SudokuGrid.css";
import { useState } from "react";
import { generateSudoku } from "../utils/sudokuGenerator";

function SudokuGrid({ onBack }) {
  const [puzzleData, setPuzzleData] = useState(generateSudoku());
  const [grid, setGrid] = useState(puzzleData.puzzle);
  const [solution, setSolution] = useState(puzzleData.solution);

  // 🧩 New Puzzle
  const loadNewPuzzle = () => {
    const newData = generateSudoku();
    setPuzzleData(newData);
    setGrid(newData.puzzle);
    setSolution(newData.solution);
  };

  // 🔁 Reset Puzzle
  const resetPuzzle = () => {
    setGrid(puzzleData.puzzle.map((row) => [...row]));
  };

  const checkAnswer = () => {
    if (JSON.stringify(grid) === JSON.stringify(solution)) {
      alert("✅ Correct! Well done!");
    } else {
      alert("❌ Not quite, keep trying!");
    }
  };

  return (
    <div className="app-container">
      <div className="header-bar">
        <h1 className="logo">Puzzle Generator</h1>
        <h2 className="sub-title">Sudoku Puzzle</h2>
      </div>

      <div className="sudoku-layout">
        <div className="button-column">
          <button className="back-button" onClick={onBack}>Back</button>
          <button onClick={loadNewPuzzle}>New Puzzle</button>
          <button onClick={resetPuzzle}>Reset Puzzle</button>
          <button onClick={checkAnswer}>Check Answer</button>
        </div>

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
