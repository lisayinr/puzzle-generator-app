function PuzzleSelector({ onSelect }) {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Puzzle Generator</h1>
      <p className="home-subtitle">Choose a puzzle to begin</p>

      <div className="home-buttons">
        <button onClick={() => onSelect('sudoku')}>Sudoku</button>
        <button onClick={() => onSelect('wordsearch')}>Word Search</button>
      </div>
    </div>
  );
}

export default PuzzleSelector;
