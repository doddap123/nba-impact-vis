// src/components/MetricPanel.js
import React from 'react';

function MetricPanel({ selectedMetricLabel, selectedTeam, playerCount, average }) {
  return (
    <div className="panel-bg rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Summary</h3>
      <div className="text-sm space-y-1">
        <p><span className="font-medium">Metric:</span> {selectedMetricLabel}</p>
        <p><span className="font-medium">Team:</span> {selectedTeam === 'All' ? 'All Teams' : selectedTeam}</p>
        <p><span className="font-medium">Players:</span> {playerCount}</p>
        <p><span className="font-medium">Average:</span> {average.toFixed(1)}</p>
      </div>
    </div>
  );
}

export default MetricPanel;
