import React from 'react';

export const GameHeader = ({ frame, throwsLeft, score, totalScore, lastThrowScore }) => (
  <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white text-center mb-4">🎳 3D Bowling</h1>
      
      <div className="flex justify-between items-center text-white">
        <div className="bg-black/50 px-4 py-2 rounded">
          <span className="text-sm opacity-70">Frame</span>
          <p className="text-2xl font-bold">{frame}/10</p>
        </div>
        
        <div className="bg-black/50 px-4 py-2 rounded">
          <span className="text-sm opacity-70">Hody</span>
          <p className="text-2xl font-bold">{throwsLeft}</p>
        </div>
        
        <div className="bg-black/50 px-4 py-2 rounded">
          <span className="text-sm opacity-70">Tento frame</span>
          <p className="text-2xl font-bold">{score}/10</p>
        </div>
        
        <div className="bg-black/50 px-4 py-2 rounded">
          <span className="text-sm opacity-70">Celkové skóre</span>
          <p className="text-3xl font-bold text-yellow-400">{totalScore}</p>
        </div>
      </div>
      
      {lastThrowScore !== null && (
        <div className="text-center mt-2">
          <p className="text-xl text-yellow-300">
            {lastThrowScore === 10 && throwsLeft === 1 ? "⚡ STRIKE!" : 
             lastThrowScore === 10 && throwsLeft === 0 ? "✨ SPARE!" :
             `Srazil jsi ${lastThrowScore} kuželek!`}
          </p>
        </div>
      )}
    </div>
  </div>
);

export const Controls = ({ isRolling, isPowerAdjusting, power, spin, onResetGame }) => (
  <div className="absolute bottom-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent w-96">
    <div className="space-y-4">
      {!isRolling && (
        <>
          <div className="flex justify-between gap-2">
            <div className="bg-black/50 p-2 rounded text-white flex-1">
              <div className="text-xs opacity-70">Síla</div>
              <div className="h-2 bg-gray-700 rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all"
                  style={{ width: `${power}%` }}
                />
              </div>
              <div className="text-center font-bold">{power}%</div>
            </div>
            
            <div className="bg-black/50 p-2 rounded text-white flex-1">
              <div className="text-xs opacity-70">Spin</div>
              <div className="flex items-center justify-center">
                <span className="text-xs">L</span>
                <div className="h-2 w-20 bg-gray-700 rounded mx-2 relative">
                  <div 
                    className="absolute top-0 h-full w-1 bg-yellow-400"
                    style={{ left: `${50 + spin * 50}%` }}
                  />
                </div>
                <span className="text-xs">R</span>
              </div>
              <div className="text-center font-bold">
                {spin > 0 ? '→' : spin < 0 ? '←' : '↑'}
              </div>
            </div>
          </div>
          
          {isPowerAdjusting && (
            <div className="text-center text-yellow-300 animate-pulse">
              <p className="text-xl">Drž šipku dolů! Síla: {power}%</p>
            </div>
          )}
        </>
      )}
      
      {isRolling && (
        <div className="text-center text-white">
          <p className="text-xl animate-pulse">🎳 Koule letí...</p>
        </div>
      )}
      
      <button
        onClick={onResetGame}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors text-sm"
      >
        Nová hra
      </button>
    </div>
  </div>
);

export const Instructions = () => (
  <div className="absolute left-4 top-32 bg-black/70 p-4 rounded-lg text-white max-w-xs">
    <h3 className="font-bold mb-3 text-yellow-400">🎮 Ovládání:</h3>
    <ul className="text-sm space-y-2">
      <li className="flex items-start">
        <span className="mr-2">🖱️</span>
        <div>
          <strong>Pohyb myši</strong>
          <div className="text-xs opacity-70">Pozice koule a směr hodu</div>
        </div>
      </li>
      <li className="flex items-start">
        <span className="mr-2">⬇️</span>
        <div>
          <strong>Držet šipku dolů</strong>
          <div className="text-xs opacity-70">Nabíjení síly (pusť pro hod)</div>
        </div>
      </li>
      <li className="flex items-start">
        <span className="mr-2">🖱️</span>
        <div>
          <strong>Levé tlačítko</strong>
          <div className="text-xs opacity-70">Negativní spin (doleva)</div>
        </div>
      </li>
      <li className="flex items-start">
        <span className="mr-2">🖱️</span>
        <div>
          <strong>Pravé tlačítko</strong>
          <div className="text-xs opacity-70">Pozitivní spin (doprava)</div>
        </div>
      </li>
      <li className="flex items-start">
        <span className="mr-2">⌨️</span>
        <div>
          <strong>A/D</strong>
          <div className="text-xs opacity-70">Jemné nastavení spinu</div>
        </div>
      </li>
    </ul>
  </div>
);

export const ScoreHistory = ({ frameScores }) => {
  if (frameScores.length === 0) return null;
  
  return (
    <div className="absolute top-32 right-4 bg-black/50 p-3 rounded">
      <p className="text-white text-sm mb-2">Historie:</p>
      {frameScores.slice(-5).map((fs, i) => (
        <div key={i} className="text-white text-xs mb-1">
          Frame {fs.frame}: {fs.score} (Σ {fs.total})
        </div>
      ))}
    </div>
  );
};