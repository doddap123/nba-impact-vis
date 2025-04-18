import React from 'react';

function TopPlayers({ players, selectedMetric, selectedMetricLabel }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Top {selectedMetricLabel} Players
      </h3>
      <ul className="text-gray-700 text-sm">
        {players.map((p, index) => (
          <li 
            key={p.name} 
            className="flex justify-between border-b border-gray-200 py-1 last:border-b-0"
          >
            <span>{index + 1}. {p.name}</span>
            <span className="font-medium">{p[selectedMetric]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopPlayers;
