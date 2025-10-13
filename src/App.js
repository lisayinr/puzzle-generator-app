import { useState } from "react";
import PuzzleSelector from "./components/PuzzleSelector";
import SudokuGrid from "./components/SudokuGrid";
import WordSearchGrid from "./components/WordSearchGrid";

function App() {
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);

  return (
    <div>
      {/* If no puzzle selected, show the selector */}
      {!selectedPuzzle && <PuzzleSelector onSelect={setSelectedPuzzle} />}

      {/* Show Sudoku if selected */}
      {selectedPuzzle === "sudoku" && (
        <div>
          <SudokuGrid />
          <button className="back-button" onClick={() => setSelectedPuzzle(null)}>Back</button>
        </div>
      )}

      {/* Show Word Search if selected */}
      {selectedPuzzle === "wordsearch" && (
        <div>
          <WordSearchGrid />
          <button className="back-button" onClick={() => setSelectedPuzzle(null)}>Back</button>
        </div>
      )}
    </div>
  );
}

export default App;