// src/components/TopPlayers.js
import React from 'react';

function TopPlayers({ players, selectedMetricLabel }) {
  return (
    <div className="panel-bg rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Top {selectedMetricLabel} Players</h3>
      <ul className="text-sm">
        {players.map((p, i) => (
          <li key={p.name} className="flex justify-between border-b border-[var(--grid)] py-1 last:border-b-0">
            <span>{i+1}. {p.name}</span>
            <span>{p[selectedMetricLabel.toLowerCase()]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopPlayers;
