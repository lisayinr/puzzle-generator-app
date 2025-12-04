import { useState, useEffect } from "react";
import { generateWordSearch } from "../utils/wordSearchGenerator";
import "./WordSearchGrid.css";
import confetti from "canvas-confetti";

function WordSearchGrid({ onBack }) {
  const [puzzleData, setPuzzleData] = useState(generateWordSearch());
  const { grid, words } = puzzleData;

  const [startCell, setStartCell] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const [foundCells, setFoundCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  const [highlightStyle, setHighlightStyle] = useState({
    width: 0,
    top: 0,
    left: 0,
    transform: "none",
    opacity: 0,
  });

  const [foundLines, setFoundLines] = useState([]);

  const [, forceRerender] = useState(0);

  useEffect(() => {
    const handleResize = () => forceRerender(x => x + 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCellCenter = (r, c) => {
    const td = document.getElementById(`cell-${r}-${c}`);
    if (!td) return { x: 0, y: 0 };

    const rect = td.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height * 0.55,
    };
  };

  const buildLineStyle = (cells) => {
    if (cells.length < 2) return { opacity: 0 };

    const start = getCellCenter(cells[0].r, cells[0].c);
    const end = getCellCenter(cells[cells.length - 1].r, cells[cells.length - 1].c);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const thickness = 18;

    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return {
      width: `${length}px`,
      left: `${start.x}px`,
      top: `${start.y - thickness / 2}px`,
      transform: `rotate(${angle}deg)`,
      opacity: 1,
    };
  };

  const buildStraightLine = (r1, c1, r2, c2) => {
    const dr = Math.sign(r2 - r1);
    const dc = Math.sign(c2 - c1);
    const length = Math.max(Math.abs(r2 - r1), Math.abs(c2 - c1));

    const cells = [];
    for (let i = 0; i <= length; i++) {
      cells.push({ r: r1 + dr * i, c: c1 + dc * i });
    }
    return cells;
  };

  const handleMouseDown = (r, c) => {
    setStartCell({ r, c });
    setSelectedCells([{ r, c }]);
    setIsDragging(true);
    setHighlightStyle((s) => ({ ...s, opacity: 0 }));
  };

  const handleMouseEnter = (r, c) => {
    if (!isDragging || !startCell) return;

    const lineCells = buildStraightLine(startCell.r, startCell.c, r, c);
    setSelectedCells(lineCells);

    const start = getCellCenter(startCell.r, startCell.c);
    const end = getCellCenter(r, c);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const thickness = 18;

    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    setHighlightStyle({
      width: `${length}px`,
      left: `${start.x}px`,
      top: `${start.y - thickness / 2}px`,
      transform: `rotate(${angle}deg)`,
      opacity: 1,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    const selectedWord = selectedCells.map(({ r, c }) => grid[r][c]).join("");
    const reversed = [...selectedWord].reverse().join("");

    const matched =
      words.includes(selectedWord) || words.includes(reversed);

    if (matched) {
      const canonical =
        words.includes(selectedWord) ? selectedWord : reversed;

      if (!foundWords.includes(canonical)) {
        setFoundWords([...foundWords, canonical]);
        setFoundCells((prev) => [...prev, ...selectedCells]);
        setFoundLines((prev) => [...prev, { cells: selectedCells }]);
        setHighlightStyle((s) => ({ ...s, opacity: 0 }));

        if (foundWords.length + 1 === words.length) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.3 },
          });

          setTimeout(() => {
            loadNewPuzzle();
          }, 1000);
        }
      }
    } else {
      setHighlightStyle((s) => ({ ...s, opacity: 0 }));
    }

    setSelectedCells([]);
    setStartCell(null);
  };

  const isFound = (r, c) =>
    foundCells.some((cell) => cell.r === r && cell.c === c);

  const loadNewPuzzle = () => {
    setPuzzleData(generateWordSearch());
    setFoundCells([]);
    setFoundWords([]);
    setSelectedCells([]);
    setHighlightStyle((s) => ({ ...s, opacity: 0 }));
    setFoundLines([]);
  };

  return (
    <div className="app-container">
      <div className="header-bar">
        <h1 className="logo">Puzzle Generator</h1>
        <h2 className="sub-title">Word Search</h2>
      </div>

      <div className="wordsearch-layout">
        <div className="button-column">
          <button className="back-button" onClick={onBack}>Back</button>
          <button onClick={loadNewPuzzle}>New Puzzle</button>
        </div>

        <div className="wordsearch-container">
          {foundLines.map((line, idx) => (
            <div
              key={idx}
              className="highlight-line"
              style={buildLineStyle(line.cells)}
            />
          ))}

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
