import React from 'react';

function MetricPanel({ selectedMetricLabel, selectedTeam, playerCount, average }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Summary</h3>
      {/* Stats list */}
      <div className="text-gray-700 text-sm space-y-1">
        <p><span className="font-medium">Metric:</span> {selectedMetricLabel}</p>
        <p>
          <span className="font-medium">Team:</span>{" "}
          {selectedTeam === 'All' ? 'All Teams' : selectedTeam}
        </p>
        <p><span className="font-medium">Players:</span> {playerCount}</p>
        <p>
          <span className="font-medium">Average {selectedMetricLabel}:</span>{" "}
          {average.toFixed(1)}
        </p>
      </div>
    </div>
  );
}

export default MetricPanel;
