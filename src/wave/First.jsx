import React, { useEffect, useState } from "react";
import "./First.css";
const App = () => {
  const rows = 15; // Number of rows
  const cols = 20; // Number of columns
  const waveWidth = 5; // Number of columns covered by the wave
  const [grid, setGrid] = useState([]);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [waveStart, setWaveStart] = useState(0); // Starting column of the wave
  const [colorIndex, setColorIndex] = useState(0); // Current color index

  const colors = ["green", "cyan", "blue", "purple", "pink"]; // Wave colors
  const colorChangeInterval = 4000; // Time interval to change color (in ms)

  // Generate grid on mount
  useEffect(() => {
    const tempGrid = Array.from({ length: rows }, () =>
      Array(cols).fill("black")
    );
    setGrid(tempGrid);
  }, [rows, cols]);

  // Handle wave movement and color change
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveStart((prev) => {
        // Calculate the next wave start column
        const next = prev + direction;
        if (next < 0 || next > cols - waveWidth) {
          setDirection(-direction); // Reverse direction
          return prev - direction;
        }
        return next;
      });
    }, 200);

    const colorInterval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, colorChangeInterval);

    return () => {
      clearInterval(interval);
      clearInterval(colorInterval);
    };
  }, [direction, cols, waveWidth, colors.length, colorChangeInterval]);

// Update grid cells for wave effect

const getCellColor = (row, col) => {
    if (col >= waveStart && col < waveStart + waveWidth) {
      // Calculate relative position for opacity
      const relativePosition =
        direction === 1
          ? waveWidth - (col - waveStart) - 1 // Lighter to darker (left to right)
          : col - waveStart; // Darker to lighter (right to left)
  
      const opacity = 1 - relativePosition / waveWidth;
      return `rgba(${getColorRGB(colors[colorIndex])}, ${opacity})`;
    }
    return "black";
  };
  // Helper to convert color names to RGB
  const getColorRGB = (color) => {
    const mapping = {
      green: "0, 255, 0",
      cyan: "0, 255, 255",
      blue: "0, 0, 255",
      purple: "128, 0, 128",
      pink: "255, 20, 147",
    };
    return mapping[color] || "0, 0, 0";
  };

  return (
    <div className="grid">
      {grid.map((row, rowIndex) =>
        row.map((_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="cell"
            style={{ backgroundColor: getCellColor(rowIndex, colIndex) }}
          ></div>
        ))
      )}
    </div>
  );
};

export default App;
