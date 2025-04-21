// src/components/Dropdowns.js
import React from 'react';

function Dropdowns({
  selectedMetric,
  onMetricChange,
  selectedTeam,
  onTeamChange,
  teamOptions
}) {
  const metricOptions = [
    { value: 'combined',        label: 'CRAFT' },
    { value: 'points',       label: 'Points' },
    { value: 'rebounds',     label: 'Rebounds' },
    { value: 'assists',      label: 'Assists' },
    { value: 'fgPct',        label: 'FG%' },
    { value: 'threePct',     label: '3PT%' },
    { value: 'tsPct',        label: 'TS%' },
    { value: 'contractValue',label: 'Contract Rank' }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
      {/* Metric */}
      <div className="flex flex-col">
        <label className="text-sm label-subtext mb-1">Metric</label>
        <select
          value={selectedMetric}
          onChange={e => onMetricChange(e.target.value)}
          className="select-control"
        >
          {metricOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {/* Team */}
      <div className="flex flex-col">
        <label className="text-sm label-subtext mb-1">Team</label>
        <select
          value={selectedTeam}
          onChange={e => onTeamChange(e.target.value)}
          className="select-control"
        >
          {teamOptions.map(team => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Dropdowns;
