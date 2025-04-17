import React from 'react';

const TopPlayers = ({ data }) => {
  const top = [...data].sort((a, b) => b.stat - a.stat).slice(0, 5);
  return (
    <div className="bg-white p-4 rounded shadow max-w-xs">
      <h4 className="font-semibold mb-2">Top Players</h4>
      <ol className="list-decimal list-inside text-sm">
        {top.map(p => <li key={p.name}>{p.name}</li>)}
      </ol>
    </div>
  );
};

export default TopPlayers;