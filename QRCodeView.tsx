import React from 'react';

interface QRCodeViewProps {
  value: string;
  size?: number;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({ value, size = 180 }) => {
  // Deterministic SVG QR-like matrix generation based on payload string
  const gridSize = 21;
  const hash = value.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 7);

  // Position detection patterns (corner 7x7 squares)
  const isFinderPattern = (r: number, c: number) => {
    // Top-left
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // Top-right
    if (r < 7 && c >= gridSize - 7) {
      const oc = c - (gridSize - 7);
      if (r === 0 || r === 6 || oc === 0 || oc === 6) return true;
      if (r >= 2 && r <= 4 && oc >= 2 && oc <= 4) return true;
      return false;
    }
    // Bottom-left
    if (r >= gridSize - 7 && c < 7) {
      const or = r - (gridSize - 7);
      if (or === 0 || or === 6 || c === 0 || c === 6) return true;
      if (or >= 2 && or <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    return null;
  };

  const cells: { r: number; c: number; filled: boolean }[] = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const finder = isFinderPattern(r, c);
      if (finder !== null) {
        cells.push({ r, c, filled: finder });
      } else {
        // Pseudo-random pseudo QR data fill based on hash and coordinates
        const cellHash = Math.abs(Math.sin((r * 33 + c * 47) ^ hash) * 10000);
        const filled = (cellHash % 10) > 4.2;
        cells.push({ r, c, filled });
      }
    }
  }

  const cellSize = size / gridSize;

  return (
    <div 
      className="p-3 bg-white rounded-2xl shadow-inner border border-emerald-100 flex flex-col items-center justify-center"
      style={{ width: size + 24, height: size + 24 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="#ffffff" />
        {cells.map(({ r, c, filled }, i) => 
          filled ? (
            <rect
              key={i}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.15}
              height={cellSize + 0.15}
              fill="#064e3b"
              rx={cellSize * 0.15}
            />
          ) : null
        )}
      </svg>
    </div>
  );
};
