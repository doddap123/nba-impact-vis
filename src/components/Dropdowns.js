import React from 'react';

function Dropdowns({ 
  selectedMetric, onMetricChange, 
  selectedTeam, onTeamChange, 
  teamOptions 
}) {
  // Define metric options for the metric dropdown
  const metricOptions = [
    { value: 'offense', label: 'Offensive Impact' },
    { value: 'defense', label: 'Defensive Impact' },
    { value: 'totalImpact', label: 'Total Impact' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Metric Selection Dropdown */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Metric:
        </label>
        <select 
          className="p-2 border border-gray-300 rounded focus:outline-none"
          value={selectedMetric}
          onChange={e => onMetricChange(e.target.value)}
        >
          {metricOptions.map(opt => (
            <option value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Team Selection Dropdown */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Team:
        </label>
        <select 
          className="p-2 border border-gray-300 rounded focus:outline-none"
          value={selectedTeam}
          onChange={e => onTeamChange(e.target.value)}
        >
          {teamOptions.map(team => (
            <option value={team} key={team}>
              {team === 'All' ? 'All Teams' : team}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Dropdowns;
