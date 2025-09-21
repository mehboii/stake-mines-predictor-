
import React, { useState } from 'react';

interface PredictionFormProps {
  onSubmit: (serverSeed: string, clientSeed: string, nonce: string, mines: number) => void;
  isLoading: boolean;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading }) => {
  const [serverSeed, setServerSeed] = useState('');
  const [clientSeed, setClientSeed] = useState('');
  const [nonce, setNonce] = useState('1');
  const [mines, setMines] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serverSeed.trim() && clientSeed.trim() && nonce.trim()) {
      onSubmit(serverSeed, clientSeed, nonce, mines);
    }
  };

  const InputField: React.FC<{
      label: string; 
      id: string; 
      value: string; 
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
      placeholder: string;
      type?: string;
    }> = ({ label, id, value, onChange, placeholder, type = 'text' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
            {label}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
            required
        />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-emerald-400 mb-4 text-center">Game Parameters</h2>
      
      <InputField 
        label="Server Seed"
        id="serverSeed"
        value={serverSeed}
        onChange={(e) => setServerSeed(e.target.value)}
        placeholder="Enter server seed"
      />

      <InputField 
        label="Client Seed"
        id="clientSeed"
        value={clientSeed}
        onChange={(e) => setClientSeed(e.target.value)}
        placeholder="Enter client seed"
      />
      
      <InputField 
        label="Nonce"
        id="nonce"
        type="number"
        value={nonce}
        onChange={(e) => setNonce(e.target.value)}
        placeholder="Enter nonce (game number)"
      />

      <div>
        <label htmlFor="mines" className="block text-sm font-medium text-slate-300 mb-2">
          Number of Mines ({mines})
        </label>
        <input
          type="range"
          id="mines"
          min="1"
          max="24"
          value={mines}
          onChange={(e) => setMines(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-cyan-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Predicting...
          </>
        ) : (
          'Predict Mine Placements'
        )}
      </button>
    </form>
  );
};
