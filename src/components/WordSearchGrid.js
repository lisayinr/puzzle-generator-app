import "./WordSearchGrid.css";
import { generateWordSearch } from "../utils/wordSearchGenerator";

function WordSearchGrid() {
  const { grid, words } = generateWordSearch();

  return (
    <div className="wordsearch-container">
      <h2>Word Search Puzzle</h2>

      <table>
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((letter, colIndex) => (
                <td key={colIndex}>{letter}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="word-list">
        <h3>Words Bank:</h3>
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