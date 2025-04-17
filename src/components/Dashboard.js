import React, { useState } from 'react';
import sampleData from '../data/sampleData';
import ScatterPlot from './ScatterPlot';
import Dropdowns from './Dropdowns';
import MetricPanel from './MetricPanel';
import TopPlayers from './TopPlayers';

const Dashboard = () => {
  const [filters, setFilters] = useState({ team: 'All', pos: 'All', stat: 'stat' });
  const teams = [...new Set(sampleData.map(d => d.team))];
  const positions = [...new Set(sampleData.map(d => d.pos))];
  const stats = ['stat'];

  const filtered = sampleData.filter(d => (
    (filters.team === 'All' || d.team === filters.team) &&
    (filters.pos === 'All' || d.pos === filters.pos)
  ));

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">NBA Player Impact Dashboard</h1>
      <ScatterPlot data={filtered} />
      <div className="flex gap-6 justify-center mt-4">
        <Dropdowns
          teams={teams}
          positions={positions}
          stats={stats}
          filters={filters}
          setFilters={setFilters}
        />
        <MetricPanel />
        <TopPlayers data={filtered} />
      </div>
    </div>
  );
};

export default Dashboard;