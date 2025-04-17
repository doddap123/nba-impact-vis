import React from 'react';

const Dropdowns = ({ teams, positions, stats, filters, setFilters }) => {
  const handleChange = key => e => {
    setFilters(prev => ({ ...prev, [key]: e.target.value }));
  };
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium">
        Team:
        <select className="ml-2 p-1 rounded border" onChange={handleChange('team')}>
          <option>All</option>
          {teams.map(t => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium">
        Position:
        <select className="ml-2 p-1 rounded border" onChange={handleChange('pos')}>
          <option>All</option>
          {positions.map(p => <option key={p}>{p}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium">
        Stat:
        <select className="ml-2 p-1 rounded border" onChange={handleChange('stat')}>
          {stats.map(s => <option key={s}>{s}</option>)}
        </select>
      </label>
    </div>
  );
};

export default Dropdowns;