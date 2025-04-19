// File: src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import { players } from '../data/sampleData';
import Dropdowns from './Dropdowns';
import ScatterPlot from './ScatterPlot';
import RankedTable from './RankedTable';
import RadarChart from './RadarChart';

function Dashboard() {
  const [selectedMetric, setSelectedMetric]     = useState('points');
  const [selectedTeam, setSelectedTeam]         = useState('All');
  const [selectedPos, setSelectedPos]           = useState('All');
  const [activeTab, setActiveTab]               = useState('distribution');
  const [selectedPlayer, setSelectedPlayer]     = useState(players[0]);
  const [brushMode, setBrushMode]               = useState(false);
  const [brushedPlayers, setBrushedPlayers]     = useState(null);

  const teamOptions     = ['All', ...new Set(players.map(p => p.team))];
  const positionOptions = ['All', 'PG', 'SG', 'SF', 'PF', 'C'];

  // Base filter by team & position
  const filteredPlayers = players.filter(p =>
    (selectedTeam === 'All' || p.team === selectedTeam) &&
    (selectedPos  === 'All' || p.pos  === selectedPos)
  );

  // If brushed subset exists, use it; otherwise use filteredPlayers
  const viewPlayers = brushedPlayers ?? filteredPlayers;

  // If the selectedPlayer is filtered out, pick the first in viewPlayers
  useEffect(() => {
    if (!viewPlayers.find(p => p.name === selectedPlayer.name)) {
      setSelectedPlayer(viewPlayers[0] || players[0]);
    }
  }, [viewPlayers, selectedPlayer]);

  // Called when brush completes
  const handleBrushSelection = subset => {
    setBrushedPlayers(subset);
    setBrushMode(false);
  };

  // Reset to full view
  const handleReset = () => {
    setBrushedPlayers(null);
    setBrushMode(false);
  };

  const selectedMetricLabel = selectedMetric.toUpperCase();

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        NBA Player Impact Dashboard
      </h1>

      {/* Filters */}
      <Dropdowns
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        selectedPos={selectedPos}
        onPosChange={setSelectedPos}
        teamOptions={teamOptions}
        positionOptions={positionOptions}
      />

      {/* Brush Mode Toggle & Reset */}
      <div className="mt-6 flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={brushMode}
            onChange={() => {
              setBrushMode(!brushMode);
              if (!brushMode) setBrushedPlayers(null);
            }}
            className="form-checkbox"
          />
          <span className="text-sm text-gray-700">Enable Brush Mode</span>
        </label>
        <button
          onClick={handleReset}
          className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Reset View
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'distribution'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('distribution')}
          >
            Distribution
          </button>
          <button
            className={`ml-6 px-4 py-2 text-sm font-medium ${
              activeTab === 'profiles'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profiles')}
          >
            Player Profiles
          </button>
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {activeTab === 'distribution' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScatterPlot
              players={viewPlayers}
              selectedMetric={selectedMetric}
              selectedMetricLabel={selectedMetricLabel}
              selectedPlayer={selectedPlayer}
              brushMode={brushMode}
              onBrushSelection={handleBrushSelection}
              onSelectPlayer={setSelectedPlayer}
            />
            <RankedTable
              players={viewPlayers}
              selectedMetric={selectedMetric}
              selectedPlayer={selectedPlayer}
              onSelectPlayer={setSelectedPlayer}
            />
          </div>
        )}

        {activeTab === 'profiles' && (
          <div className="mt-4">
            <RadarChart
              player={selectedPlayer}
              players={viewPlayers}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
