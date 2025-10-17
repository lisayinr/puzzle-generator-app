import "./SudokuGrid.css";
import { useState } from "react";
import { generateSudoku } from "../utils/sudokuGenerator";

function SudokuGrid() {
  const initialData = generateSudoku();
  const [puzzle, setPuzzle] = useState(initialData.puzzle);
  const [grid, setGrid] = useState(initialData.puzzle);
  const [solution, setSolution] = useState(initialData.solution);

  const loadNewPuzzle = () => {
    const newData = generateSudoku();
    setPuzzle(newData.puzzle);
    setGrid(newData.puzzle);
    setSolution(newData.solution);
  };

  const checkAnswer = () => {
    if (JSON.stringify(grid) === JSON.stringify(solution)) {
      alert("✅ Correct! You solved the puzzle!");
    } else {
      alert("❌ Not quite — keep trying!");
    }
  };

  return (
    <div className="app-container">
      <header className="header-bar">
        <h1 className="logo">Puzzle Hub</h1>
        <h2 className="sub-title">Sudoku</h2>
      </header>

      <div className="sudoku-layout">
        <div className="button-column">
          <button onClick={checkAnswer}>Check Answer</button>
          <button onClick={loadNewPuzzle}>New Puzzle</button>
        </div>

        <div className="sudoku-grid">
          <table>
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>
                      {puzzle[rowIndex][colIndex] !== 0 ? (
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