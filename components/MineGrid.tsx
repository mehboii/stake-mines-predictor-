
import React from 'react';
import type { Cell } from '../types';
import { GridCell } from './GridCell';

interface MineGridProps {
  grid: Cell[][];
  revealedCells: Set<string>;
  onCellClick: (x: number, y: number) => void;
}

export const MineGrid: React.FC<MineGridProps> = ({ grid, revealedCells, onCellClick }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-slate-300 mb-4">Predicted Minefield</h3>
      <div className="grid grid-cols-5 gap-2 p-2 bg-slate-900 rounded-lg">
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <GridCell 
              key={`${x}-${y}`} 
              cell={{...cell, revealed: revealedCells.has(`${x}-${y}`)}} 
              onClick={() => onCellClick(x, y)}
            />
          ))
        )}
      </div>
    </div>
  );
};
