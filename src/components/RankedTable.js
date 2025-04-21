// src/components/RankedTable.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function RankedTable({ players, selectedMetric, selectedPlayer, onSelectPlayer }) {
  const tableRef = useRef();
  const [sortConfig, setSortConfig]   = useState({ key: selectedMetric, direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const columns = [
      { label: 'Name',          key: 'name' },
      { label: 'Team',          key: 'team' },
      { label: 'Effectiveness', key: selectedMetric },
      { label: 'Contract Rank', key: 'contractValue' }
    ];

    // filter & sort
    const filtered = players.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sorted = [...filtered].sort((a,b) => {
      const aVal = a[sortConfig.key], bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction==='asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction==='asc' ? 1 : -1;
      return 0;
    });

    // build table
    const table = d3.select(tableRef.current);
    table.selectAll('*').remove();

    // header
    const thead = table.append('thead').append('tr');
    thead.selectAll('th')
      .data(columns)
      .enter().append('th')
      .html(d => {
        const arrow = d.key === sortConfig.key
          ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')
          : '';
        return `<span style="color:var(--text)">${d.label}${arrow}</span>`;
      })
      .style('cursor','pointer')
      .style('padding','8px')
      .style('background','var(--panel)')
      .on('click', (_, col) => {
        if (col.key === sortConfig.key) {
          setSortConfig({
            key: col.key,
            direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
          });
        } else {
          setSortConfig({ key: col.key, direction: 'desc' });
        }
      });

    // body
    const tbody = table.append('tbody');
    const rows = tbody.selectAll('tr')
      .data(sorted)
      .enter().append('tr')
      .style('background', d => d.name === selectedPlayer.name ? 'var(--accent)' : 'transparent')
      .style('cursor','pointer')
      .on('click', (_, d) => onSelectPlayer(d));

    rows.selectAll('td')
      .data(row => columns.map(col => {
        let val = row[col.key];
        if (col.key === selectedMetric) val = Number(val).toFixed(2);
        return val;
      }))
      .enter().append('td')
      .text(d => d)
      .style('padding','6px 8px')
      .style('border-bottom','1px solid var(--grid)')
      .style('color','var(--text)');

    table.style('width','100%').style('border-collapse','collapse');
  }, [players, selectedMetric, sortConfig, selectedPlayer, onSelectPlayer, searchQuery]);

  return (
    <div className="bg-gray-800 rounded-lg shadow p-4">
      <input
        type="text"
        className="mb-4 w-full select-control"
        placeholder="Search player name…"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <div className="scroll-table border border-[var(--grid)] rounded">
        <table ref={tableRef} className="min-w-full table-auto" />
      </div>
    </div>
  );
}

export default RankedTable;
