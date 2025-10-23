import { useState } from "react";
import { generateWordSearch } from "../utils/wordSearchGenerator";
import "./WordSearchGrid.css";

function WordSearchGrid({ onBack }) {
  const [puzzleData] = useState(generateWordSearch());
  const { grid, words } = puzzleData;

  const [selectedCells, setSelectedCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [foundCells, setFoundCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  const handleMouseDown = (r, c) => {
    setSelectedCells([[r, c]]);
    setIsDragging(true);
  };

  const handleMouseEnter = (r, c) => {
    if (isDragging) {
      setSelectedCells((prev) => {
        const already = prev.some(([pr, pc]) => pr === r && pc === c);
        return already ? prev : [...prev, [r, c]];
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    const selectedWord = selectedCells.map(([r, c]) => grid[r][c]).join("").toUpperCase();
    const reversed = selectedWord.split("").reverse().join("");

    if (words.includes(selectedWord) || words.includes(reversed)) {
      alert(`✅ Found ${selectedWord}!`);
      setFoundWords((prev) => [...prev, selectedWord]);
      setFoundCells((prev) => [...prev, ...selectedCells]);
    }

    setSelectedCells([]);
  };

  const isSelected = (r, c) =>
    selectedCells.some(([sr, sc]) => sr === r && sc === c);

  const isFound = (r, c) =>
    foundCells.some(([fr, fc]) => fr === r && fc === c);

  return (
    <div className="app-container">
      {/* Header Bar */}
      <div className="header-bar">
        <h1 className="logo">Puzzle Generator</h1>
        <h2 className="sub-title">Word Search Puzzle</h2>
      </div>

      <div className="wordsearch-layout">
        {/* Left column: Back button */}
        <div className="button-column">
          <button className="back-button" onClick={onBack}>Back</button>
        </div>

        {/* Right column: Grid and word list */}
        <div className="wordsearch-container">
          <table onMouseLeave={() => setIsDragging(false)}>
            <tbody>
              {grid.map((row, r) => (
                <tr key={r}>
                  {row.map((letter, c) => (
                    <td
                      key={c}
                      className={
                        isSelected(r, c)
                          ? "highlighted"
                          : isFound(r, c)
                          ? "found"
                          : ""
                      }
                      onMouseDown={() => handleMouseDown(r, c)}
                      onMouseEnter={() => handleMouseEnter(r, c)}
                      onMouseUp={handleMouseUp}
                    >
                      {letter}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="word-list">
            <h3>Word Bank:</h3>
            <ul>
              {words.map((w, i) => (
                <li
                  key={i}
                  className={foundWords.includes(w) ? "found-word" : ""}
                >
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordSearchGrid;