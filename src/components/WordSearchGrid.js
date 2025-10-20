import { useState } from "react";
import { generateWordSearch } from "../utils/wordSearchGenerator";
import "./WordSearchGrid.css";

function WordSearchGrid() {
  const [puzzleData] = useState(generateWordSearch());
  const { grid, words } = puzzleData;
  const [selectedCells, setSelectedCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
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
    // Later: check if the highlighted letters match a word
  };

  const isSelected = (r, c) =>
    selectedCells.some(([sr, sc]) => sr === r && sc === c);

  return (
    <div className="wordsearch-container">
      <h2>Word Search Puzzle</h2>

      <table onMouseLeave={() => setIsDragging(false)}>
        <tbody>
          {grid.map((row, r) => (
            <tr key={r}>
              {row.map((letter, c) => (
                <td
                  key={c}
                  className={isSelected(r, c) ? "highlighted" : ""}
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
        <h3>Find these words:</h3>
        <ul>
          {words.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default WordSearchGrid;




// import { useState } from "react";
// import "./WordSearchGrid.css";
// import { generateWordSearch } from "../utils/wordSearchGenerator";

// function WordSearchGrid() {
//   const { grid, words } = generateWordSearch();

//   return (
//     <div className="wordsearch-container">
//       <h2>Word Search Puzzle</h2>

//       <table>
//         <tbody>
//           {grid.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {row.map((letter, colIndex) => (
//                 <td key={colIndex}>{letter}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="word-list">
//         <h3>Words Bank:</h3>
//         <ul>
//           {words.map((w, i) => (
//             <li key={i}>{w}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default WordSearchGrid;