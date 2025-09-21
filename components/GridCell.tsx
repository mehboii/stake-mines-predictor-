import React from 'react';
import type { Cell } from '../types';
import { BombIcon } from './icons/BombIcon';
import { GemIcon } from './icons/GemIcon';

interface GridCellProps {
  cell: Cell;
  onClick: () => void;
}

export const GridCell: React.FC<GridCellProps> = ({ cell, onClick }) => {
  const isRevealed = cell.revealed;
  const isMine = cell.isMine;

  const baseStyle = "w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-lg transition-all duration-300 ease-in-out cursor-pointer";
  
  const revealedStyle = isMine 
    ? "bg-red-500/20 border-2 border-red-500" 
    : "bg-emerald-500/20 border-2 border-emerald-500";

  const unrevealedStyle = "bg-slate-700 hover:bg-slate-600 transform hover:scale-105";

  return (
    <div 
      className={`${baseStyle} ${isRevealed ? revealedStyle : unrevealedStyle}`}
      onClick={isMine ? undefined : onClick}
      style={{
        perspective: '1000px',
      }}
    >
        <div className={`relative w-full h-full transition-transform duration-500 ${isRevealed ? '[transform:rotateY(180deg)]' : ''}`} style={{ transformStyle: 'preserve-3d'}}>
            {/* Front of card (hidden) */}
            <div className="absolute w-full h-full [backface-visibility:hidden]">
                {/* Empty or can add a question mark icon */}
            </div>
            
            {/* Back of card (visible) */}
            <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex justify-center items-center">
                {isMine ? (
                    <BombIcon className="w-8 h-8 text-red-400" />
                ) : (
                    <GemIcon className="w-8 h-8 text-emerald-400" />
                )}
            </div>
        </div>
    </div>
  );
};