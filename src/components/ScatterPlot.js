import React from 'react';

function ScatterPlot({ players, selectedMetricLabel }) {
  // Define max values for scales (assuming values out of 10 for simplicity)
  const maxOffense = 10;
  const maxDefense = 10;

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Offensive vs Defensive Impact
      </h3>
      {/* Chart container */}
      <div className="relative bg-gray-50 border border-gray-300 rounded-sm" style={{ width: '100%', height: '256px' }}>
        {players.map(p => {
          // Calculate positions as percentage
          const leftPercent = (p.offense / maxOffense) * 100;
          const bottomPercent = (p.defense / maxDefense) * 100;
          return (
            <div 
              key={p.name}
              className="absolute bg-blue-500 opacity-75 rounded-full"
              style={{
                width: '12px',
                height: '12px',
                left: `${leftPercent}%`,
                bottom: `${bottomPercent}%`,
                transform: 'translate(-50%, -50%)'  // center the dot
              }}
              title={`${p.name}: Off ${p.offense}, Def ${p.defense}`}
            />
          );
        })}
        {/* Axes labels */}
        <span className="absolute bottom-1 right-2 text-xs text-gray-600">
          Offense →
        </span>
        <span className="absolute top-2 left-1 text-xs text-gray-600 rotate-90 origin-top-left">
          Defense →
        </span>
      </div>
    </div>
  );
}

export default ScatterPlot;
