import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function RankedTable({ players, selectedMetric, selectedPlayer, onSelectPlayer }) {
  const tableRef = useRef();
  const [sortConfig, setSortConfig] = useState({ key: selectedMetric, direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const columns = [
      { label: 'Name', key: 'name' },
      { label: 'Team', key: 'team' },
      { label: 'Pos', key: 'pos' },
      { label: 'Effectiveness', key: selectedMetric },
      { label: 'Contract ($M)', key: 'contractValue' }
    ];

    const filtered = players.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    const table = d3.select(tableRef.current);
    table.selectAll('*').remove();

    // header
    const thead = table.append('thead').append('tr');
    thead.selectAll('th')
      .data(columns)
      .enter()
      .append('th')
      .html(d => {
        const arrow = d.key === sortConfig.key ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : '';
        return d.label + arrow;
      })
      .style('cursor', 'pointer')
      .style('padding', '8px')
      .style('background', '#f3f4f6')
      .on('click', (_, col) => {
        if (col.key === sortConfig.key) {
          setSortConfig({ key: col.key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
        } else {
          setSortConfig({ key: col.key, direction: 'desc' });
        }
      });

    // body
    const tbody = table.append('tbody');
    const rows = tbody.selectAll('tr')
      .data(sorted)
      .enter()
      .append('tr')
      .style('background', d => d.name === selectedPlayer.name ? '#bfdbfe' : 'transparent')
      .style('cursor', 'pointer')
      .on('click', (_, d) => onSelectPlayer(d));

    rows.selectAll('td')
      .data(row => columns.map(col => {
        let val = row[col.key];
        if (col.key === 'contractValue') val = (val / 1e6).toFixed(1);
        if (col.key === selectedMetric) val = val.toFixed(2);
        return val;
      }))
      .enter()
      .append('td')
      .text(d => d)
      .style('padding', '6px 8px')
      .style('border-bottom', '1px solid #e5e7eb');

    table.style('width', '100%').style('border-collapse', 'collapse');
  }, [players, selectedMetric, sortConfig, selectedPlayer, onSelectPlayer, searchQuery]);

  return (
    <div className="bg-white rounded shadow p-4 overflow-x-auto">
      <input
        type="text"
        className="mb-4 p-2 w-full border border-gray-300 rounded"
        placeholder="Search player name..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <table ref={tableRef} className="min-w-full table-auto" />
    </div>
  );
}

export default RankedTable;