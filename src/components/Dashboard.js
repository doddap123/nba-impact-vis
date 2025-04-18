import React, { useState } from 'react';
import { players } from '../data/sampleData';
import Dropdowns from './Dropdowns';
import ScatterPlot from './ScatterPlot';
import MetricPanel from './MetricPanel';
import TopPlayers from './TopPlayers';

function Dashboard() {
  // State for selected metric and team filter
  const [selectedMetric, setSelectedMetric] = useState('totalImpact');
  const [selectedTeam, setSelectedTeam] = useState('All');

  // Determine list of teams for filter dropdown (including "All")
  const teamOptions = ['All', ...new Set(players.map(p => p.team))];

  // Filter players based on selected team (if "All", include everyone)
  const filteredPlayers = selectedTeam === 'All'
    ? players
    : players.filter(p => p.team === selectedTeam);

  // Compute top 5 players by the selected metric
  const topPlayers = [...filteredPlayers]
    .sort((a, b) => b[selectedMetric] - a[selectedMetric])
    .slice(0, 5);

  // Compute average of the selected metric for the filtered players (for the MetricPanel)
  const total = filteredPlayers.reduce((sum, p) => sum + p[selectedMetric], 0);
  const avg = filteredPlayers.length ? (total / filteredPlayers.length) : 0;

  // Human-readable label for the selected metric (for display)
  const metricLabels = {
    offense: 'Offensive Impact',
    defense: 'Defensive Impact',
    totalImpact: 'Total Impact'
  };
  const selectedMetricLabel = metricLabels[selectedMetric];

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        NBA Player Impact Dashboard
      </h2>

      {/* Dropdown Filters */}
      <Dropdowns 
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        teamOptions={teamOptions}
      />

      {/* Main Content Layout: Scatter plot and side panels */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {/* Scatter Plot section (responsive: takes 2/3 width on md+) */}
        <div className="md:w-2/3">
          <ScatterPlot 
            players={filteredPlayers} 
            selectedMetricLabel={selectedMetricLabel} 
          />
        </div>

        {/* Side panel section (Metric summary and Top players) takes 1/3 width on md+ */}
        <div className="md:w-1/3 flex flex-col gap-4">
          <MetricPanel 
            selectedMetricLabel={selectedMetricLabel}
            selectedTeam={selectedTeam}
            playerCount={filteredPlayers.length}
            average={avg}
          />
          <TopPlayers 
            players={topPlayers} 
            selectedMetric={selectedMetric}
            selectedMetricLabel={selectedMetricLabel}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
