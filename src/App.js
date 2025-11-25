import "./App.css";
import { useState } from "react";
import PuzzleSelector from "./components/PuzzleSelector";
import SudokuGrid from "./components/SudokuGrid";
import WordSearchGrid from "./components/WordSearchGrid";

function App() {
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const handleBack = () => setSelectedPuzzle(null);

  return (
    <div className="app-container">
      {/* Home */}
      {!selectedPuzzle && (
        <>
          <PuzzleSelector onSelect={setSelectedPuzzle} />
        </>
      )}

      {/* Sudoku */}
      {selectedPuzzle === "sudoku" && <SudokuGrid onBack={handleBack} />}

      {/* Word Search */}
      {selectedPuzzle === "wordsearch" && <WordSearchGrid onBack={handleBack} />}

      {/* Show footer only on the Home screen */}
      {!selectedPuzzle && (
        <footer className="site-footer">
          <p>Puzzle Generator © {new Date().getFullYear()} | Created by Lisa Yin</p>
        </footer>
      )}
    </div>
  );
}

export default App;
