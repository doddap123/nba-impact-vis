// File: src/components/Dropdowns.js
import React from 'react';

function Dropdowns({ selectedMetric, onMetricChange, selectedTeam, onTeamChange, selectedPos, onPosChange, teamOptions, positionOptions }) {
  const metricOptions = [
    { value: 'combined', label: 'Combined Metric' },
    { value: 'points', label: 'Points' },
    { value: 'rebounds', label: 'Rebounds' },
    { value: 'assists', label: 'Assists' },
    { value: 'fgPct', label: 'FG%' },
    { value: 'threePct', label: '3PT%' },
    { value: 'efgPct', label: 'eFG%' },
    { value: 'tsPct', label: 'TS%' },
    { value: 'contractValue', label: 'Contract Value' }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Metric */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Metric:</label>
        <select className="p-2 border border-gray-300 rounded focus:outline-none" value={selectedMetric} onChange={e => onMetricChange(e.target.value)}>
          {metricOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      {/* Team */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Team:</label>
        <select className="p-2 border border-gray-300 rounded focus:outline-none" value={selectedTeam} onChange={e => onTeamChange(e.target.value)}>
          {teamOptions.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
      </div>
      {/* Position */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Position:</label>
        <select className="p-2 border border-gray-300 rounded focus:outline-none" value={selectedPos} onChange={e => onPosChange(e.target.value)}>
          {positionOptions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
        </select>
      </div>
    </div>
  );
}

export default Dropdowns;
