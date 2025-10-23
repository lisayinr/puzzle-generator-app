import { useState } from "react";
import PuzzleSelector from "./components/PuzzleSelector";
import SudokuGrid from "./components/SudokuGrid";
import WordSearchGrid from "./components/WordSearchGrid";

function App() {
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);

  const handleBack = () => setSelectedPuzzle(null);

  return (
    <div>
      {/* Home screen */}
      {!selectedPuzzle && (
        <>
          <PuzzleSelector onSelect={setSelectedPuzzle} />
        </>
      )}

      {/* Sudoku */}
      {selectedPuzzle === "sudoku" && (
        <SudokuGrid onBack={handleBack} />
      )}

      {/* Word Search */}
      {selectedPuzzle === "wordsearch" && (
        <WordSearchGrid onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
