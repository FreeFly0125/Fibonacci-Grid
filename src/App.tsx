/** @format */

import { useState } from "react";
import "./App.css";

const GRID_SIZE = 50;

type CellState = {
  value: number;
  isAnimatingYellow: boolean;
  isAnimatingGreen: boolean;
};

function App() {
  const [grid, setGrid] = useState<CellState[][]>(() =>
    Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE)
          .fill(null)
          .map(() => ({
            value: 0,
            isAnimatingYellow: false,
            isAnimatingGreen: false,
          }))
      )
  );

  const isFibonacci = (numbers: number[]): boolean => {
    if (numbers.length < 5) return false;
    if (numbers.every((num) => num === 0)) return false;
    for (let i = 2; i < numbers.length; i++) {
      if (numbers[i] !== numbers[i - 1] + numbers[i - 2]) {
        return false;
      }
    }
    return true;
  };

  const checkFibonacciSequence = () => {
    // Check horizontal sequences
    for (let k = 0; k <= GRID_SIZE; k++) {
      for (let i = 0; i <= GRID_SIZE - 5; i++) {
        const sequence = grid[k].slice(i, i + 5).map((cell) => cell.value);
        if (isFibonacci(sequence)) {
          const newGrid = [...grid];
          for (let j = 0; j < 5; j++) {
            newGrid[k][i + j] = {
              ...newGrid[k][i + j],
              isAnimatingGreen: true,
              value: 0,
            };
          }
          setGrid(newGrid);

          setTimeout(() => {
            setGrid((prev) => {
              const resetGrid = [...prev];
              for (let j = 0; j < 5; j++) {
                resetGrid[k][i + j] = {
                  ...resetGrid[k][i + j],
                  isAnimatingGreen: false,
                };
              }
              return resetGrid;
            });
          }, 1000);
        }
      }
    }

    // Check vertical sequences
    for (let k = 0; k < GRID_SIZE; k++) {
      for (let i = 0; i <= GRID_SIZE - 5; i++) {
        const sequence = grid.slice(i, i + 5).map((row) => row[k].value);
        if (isFibonacci(sequence)) {
          const newGrid = [...grid];
          for (let j = 0; j < 5; j++) {
            newGrid[i + j][k] = {
              ...newGrid[i + j][k],
              isAnimatingGreen: true,
              value: 0,
            };
          }
          setGrid(newGrid);

          setTimeout(() => {
            setGrid((prev) => {
              const resetGrid = [...prev];
              for (let j = 0; j < 5; j++) {
                resetGrid[i + j][k] = {
                  ...resetGrid[i + j][k],
                  isAnimatingGreen: false,
                };
              }
              return resetGrid;
            });
          }, 1000);
        }
      }
    }
  };

  const handleCellClick = (row: number, col: number) => {
    const newGrid = [...grid];

    // Update row and column
    for (let i = 0; i < GRID_SIZE; i++) {
      // Update row
      newGrid[row][i] = {
        ...newGrid[row][i],
        value: newGrid[row][i].value + 1,
        isAnimatingYellow: true,
      };

      // Update column
      newGrid[i][col] = {
        ...newGrid[i][col],
        value: newGrid[i][col].value + 1,
        isAnimatingYellow: true,
      };
    }

    // Prevent double counting the intersection
    newGrid[row][col].value--;

    setGrid(newGrid);

    // Reset yellow animation
    setTimeout(() => {
      setGrid((prev) => {
        const resetGrid = [...prev];
        for (let i = 0; i < GRID_SIZE; i++) {
          resetGrid[row][i] = {
            ...resetGrid[row][i],
            isAnimatingYellow: false,
          };
          resetGrid[i][col] = {
            ...resetGrid[i][col],
            isAnimatingYellow: false,
          };
        }
        return resetGrid;
      });
    }, 1000);

    // Check for Fibonacci sequences
    checkFibonacciSequence();
  };

  return (
    <div className="container">
      <div className="grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${cell.value ? "has-value" : ""} 
                ${cell.isAnimatingYellow ? "animate-yellow" : ""}
                ${cell.isAnimatingGreen ? "animate-green" : ""}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell.value || ""}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
