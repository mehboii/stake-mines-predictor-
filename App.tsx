
import React, { useState, useCallback } from 'react';
import { PredictionForm } from './components/PredictionForm';
import { MineGrid } from './components/MineGrid';
import { predictMines } from './services/geminiService';
import type { Cell } from './types';
import { GemIcon } from './components/icons/GemIcon';

const App: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());

  const handlePredict = useCallback(async (serverSeed: string, clientSeed: string, nonce: string, mines: number) => {
    setIsLoading(true);
    setError(null);
    setGrid(null);
    setRevealedCells(new Set());

    try {
      const prediction = await predictMines(serverSeed, clientSeed, nonce, mines);
      
      const newGrid: Cell[][] = Array(5).fill(null).map(() => Array(5).fill(null));
      prediction.forEach(cellData => {
        if (cellData.y >= 0 && cellData.y < 5 && cellData.x >= 0 && cellData.x < 5) {
          newGrid[cellData.y][cellData.x] = { ...cellData, revealed: false };
        }
      });
      setGrid(newGrid);

    } catch (err) {
      console.error(err);
      setError('Failed to get prediction from AI. Please check your inputs or try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleCellClick = (x: number, y: number) => {
    if(!grid || grid[y][x].isMine) return;

    const newRevealedCells = new Set(revealedCells);
    newRevealedCells.add(`${x}-${y}`);
    setRevealedCells(newRevealedCells);
  };


  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 mb-2">
                Gemini Mine Predictor
            </h1>
            <p className="text-slate-400">AI-powered simulation for Stake's Mines game.</p>
        </header>
        
        <main className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
                <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center border border-slate-700 min-h-[300px]">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                         <div className="w-12 h-12 border-4 border-t-emerald-400 border-slate-600 rounded-full animate-spin"></div>
                         <p className="text-slate-400">AI is analyzing the seeds...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
                        <p className="font-semibold">An Error Occurred</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : grid ? (
                    <MineGrid grid={grid} revealedCells={revealedCells} onCellClick={handleCellClick} />
                ) : (
                    <div className="text-center text-slate-500 flex flex-col items-center gap-4">
                       <GemIcon className="w-16 h-16 text-slate-600"/>
                       <p className="font-medium">Prediction will appear here</p>
                       <p className="text-sm">Enter the game details to start.</p>
                    </div>
                )}
            </div>
        </main>
        
        <footer className="text-center mt-10">
          <p className="text-xs text-slate-500 bg-slate-800/50 border border-slate-700 rounded-lg p-3 max-w-2xl mx-auto">
            <span className="font-bold text-amber-400">Disclaimer:</span> This tool is for educational and entertainment purposes only. It uses an AI model to simulate predictions and does not guarantee any real-world outcomes. Do not use for financial decisions.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
