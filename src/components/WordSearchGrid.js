import { useState } from "react";
import { generateWordSearch } from "../utils/wordSearchGenerator";
import "./WordSearchGrid.css";

function WordSearchGrid({ onBack }) {
  const [puzzleData, setPuzzleData] = useState(generateWordSearch());
  const { grid, words } = puzzleData;

  const [startCell, setStartCell] = useState(null); // {r,c}
  const [selectedCells, setSelectedCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const [foundCells, setFoundCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  // active highlight overlay (current drag)
  const [highlightStyle, setHighlightStyle] = useState({
    width: 0,
    top: 0,
    left: 0,
    transform: "none",
    opacity: 0,
  });

  // permanent highlight lines for words already found
  const [foundLines, setFoundLines] = useState([]);

  /* ---------------------------------------------------
     GET PRECISE CELL CENTER USING DOM 
  --------------------------------------------------- */
  const getCellCenter = (r, c) => {
    const td = document.getElementById(`cell-${r}-${c}`);
    const rect = td.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    // Slightly below the exact center so the bar runs through letters
    const centerY = rect.top + rect.height * 0.55;

    return { x: centerX, y: centerY };
  };

  /* ---------------------------------------------------
     BUILD STRAIGHT SELECTION LINE (LOGICAL CELLS)
  --------------------------------------------------- */
  const buildStraightLine = (r1, c1, r2, c2) => {
    const dr = r2 - r1;
    const dc = c2 - c1;

    const stepR = Math.sign(dr);
    const stepC = Math.sign(dc);

    const length = Math.max(Math.abs(dr), Math.abs(dc));

    const line = [];
    for (let i = 0; i <= length; i++) {
      line.push({ r: r1 + stepR * i, c: c1 + stepC * i });
    }

    return line;
  };

  /* ---------------------------------------------------
     MOUSE DOWN (start selection)
  --------------------------------------------------- */
  const handleMouseDown = (r, c) => {
    setStartCell({ r, c });
    setSelectedCells([{ r, c }]);
    setIsDragging(true);

    // reset ACTIVE highlight overlay (keep foundLines!)
    setHighlightStyle((s) => ({ ...s, opacity: 0 }));
  };

  /* ---------------------------------------------------
     MOUSE ENTER (drag + draw highlight line)
  --------------------------------------------------- */
  const handleMouseEnter = (r, c) => {
    if (!isDragging || !startCell) return;

    const { r: sr, c: sc } = startCell;

    // logical selected cells
    const line = buildStraightLine(sr, sc, r, c);
    setSelectedCells(line);

    // REAL pixel points
    const start = getCellCenter(sr, sc);
    const end = getCellCenter(r, c);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // update active highlight bar (thickness matches CSS: 18px)
    const thickness = 18;

    setHighlightStyle({
      width: `${length}px`,
      left: `${start.x}px`,
      top: `${start.y - thickness / 2}px`,
      transform: `rotate(${angle}deg)`,
      opacity: 1,
    });
  };

  /* ---------------------------------------------------
     MOUSE UP (finalize selection)
  --------------------------------------------------- */
  const handleMouseUp = () => {
    setIsDragging(false);

    const selectedWord = selectedCells
      .map(({ r, c }) => grid[r][c])
      .join("");

    const reversed = selectedWord.split("").reverse().join("");

    const matched =
      words.includes(selectedWord) || words.includes(reversed);

    if (matched) {
      const canonical = words.includes(selectedWord)
        ? selectedWord
        : reversed;

      // add found word (no duplicates)
      setFoundWords((prev) =>
        prev.includes(canonical) ? prev : [...prev, canonical]
      );

      // add found cells
      setFoundCells((prev) => [...prev, ...selectedCells]);

      // save the CURRENT highlight line as a permanent one
      setFoundLines((prev) => [
        ...prev,
        {
          ...highlightStyle,
          opacity: 1, // ensure it's visible
        },
      ]);
    } else {
      // if not a found word → remove only the active highlight
      setHighlightStyle((s) => ({
        ...s,
        opacity: 0,
      }));
    }

    setSelectedCells([]);
    setStartCell(null);
  };

  /* ----------------- HELPERS ----------------- */
  const isFound = (r, c) =>
    foundCells.some((cell) => cell.r === r && cell.c === c);

  /* ----------------- NEW PUZZLE ----------------- */
  const loadNewPuzzle = () => {
    setPuzzleData(generateWordSearch());
    setFoundCells([]);
    setFoundWords([]);
    setSelectedCells([]);
    setHighlightStyle((s) => ({ ...s, opacity: 0 }));
    setFoundLines([]); // clear old permanent lines
  };

  return (
    <div className="app-container">
      <div className="header-bar">
        <h1 className="logo">Puzzle Generator</h1>
        <h2 className="sub-title">Word Search</h2>
      </div>

      <div className="wordsearch-layout">
        <div className="button-column">
          <button className="back-button" onClick={onBack}>
            Back
          </button>
          <button onClick={loadNewPuzzle}>New Puzzle</button>
        </div>

        {/* MAIN GRID */}
        <div className="wordsearch-container">
          {/* permanent highlight lines for found words */}
          {foundLines.map((style, idx) => (
            <div
              key={idx}
              className="highlight-line"
              style={style}
            />
          ))}

          {/* active line for current drag */}
          <div className="highlight-line" style={highlightStyle} />

          <table>
            <tbody>
              {grid.map((row, r) => (
                <tr key={r}>
                  {row.map((letter, c) => (
                    <td
                      id={`cell-${r}-${c}`}
                      key={c}
                      className={isFound(r, c) ? "found" : ""}
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
        </div>

        {/* WORD LIST */}
        <div className="word-list">
          <h3>Word Bank</h3>
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
      <footer className="footer">
        <p>Puzzle Generator © 2025 | Created by Lisa Yin</p>
      </footer>
    </div>
  );
}

export default WordSearchGrid;
