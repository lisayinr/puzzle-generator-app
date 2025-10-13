function PuzzleSelector({ onSelect }) {
  return (
    <div>
      <h2>Select a Puzzle</h2>
      <button onClick={() => onSelect('sudoku')}>Sudoku</button>
      <button onClick={() => onSelect('wordsearch')}>Word Search</button>
    </div>
  );
}

export default PuzzleSelector;