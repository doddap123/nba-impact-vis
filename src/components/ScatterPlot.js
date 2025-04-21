// src/components/ScatterPlot.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function ScatterPlot({
  players,
  selectedMetric,
  selectedPlayer,
  brushMode,
  onBrushSelection,
  onSelectPlayer
}) {
  const svgRef = useRef();

  // Dropdown label mapping
  const labelMap = {
    combined:         'CRAFT',
    points:        'Points',
    rebounds:      'Rebounds',
    assists:       'Assists',
    fgPct:         'FG%',
    threePct:      '3PT%',
    tsPct:         'TS%',
    contractValue: 'Contract Rank'
  };

  useEffect(() => {
    const width  = 700;
    const height = 400;
    const margin = { top: 60, right: 40, bottom: 50, left: 50 };
    const innerW = width  - margin.left - margin.right;
    const innerH = height - margin.top  - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
      .attr('class', 'content')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const values = players.map(p => p[selectedMetric] ?? 0);
    const maxVal = d3.max(values) || 1;

    const xScale = d3.scalePoint()
      .domain(players.map(p => p.name))
      .range([0, innerW])
      .padding(0.7);

    const yScale = d3.scaleLinear()
      .domain([0, maxVal * 1.1])
      .range([innerH, 0]);

    const rScale = d3.scaleSqrt()
      .domain(d3.extent(players, p => p.contractValue))
      .range([22, 6]);

    // Axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('fill', 'var(--text)')
      .style('font-size', '12px');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerH / 2)
      .attr('y', -margin.left + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text)')
      .attr('font-size', '13px')
      .text(`${labelMap[selectedMetric]} Effectiveness`);

    // Tooltip
    const tooltip = d3.select(svgRef.current.parentNode)
      .selectAll('.tooltip')
      .data([0])
      .join('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'var(--tooltip)')
      .style('color', 'var(--text)')
      .style('padding', '8px 12px')
      .style('border-radius', '6px')
      .style('box-shadow', '0 2px 8px rgba(0,0,0,0.08)')
      .style('font-size', '13px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Points
    g.selectAll('circle')
      .data(players)
      .enter().append('circle')
      .attr('cx', d => xScale(d.name))
      .attr('cy', d => yScale(d[selectedMetric] ?? 0))
      .attr('r', d => rScale(d.contractValue))
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.85)
      .attr('stroke', d =>
        d.name === selectedPlayer.name ? 'var(--text)' : 'none'
      )
      .attr('stroke-width', d =>
        d.name === selectedPlayer.name ? 2 : 0
      )
      .on('mouseover', function(event, d) {
        tooltip
          .style('opacity', 1)
          .html(`
            <strong>${d.name}</strong><br/>
            ${labelMap[selectedMetric]}: ${(d[selectedMetric] ?? 0).toFixed(2)}<br/>
            Contract Rank: ${d.contractValue}
          `);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', `${event.pageX + 12}px`)
          .style('top', `${event.pageY - 32}px`);
      })
      .on('mouseout', () => tooltip.style('opacity', 0))
      .on('click', (_, d) => onSelectPlayer(d));

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', '600')
      .attr('fill', 'var(--text)')
      .text(`${labelMap[selectedMetric]} Distribution`);

    // Brush
    if (brushMode) {
      const brush = d3.brush()
        .extent([[0, 0], [innerW, innerH]])
        .on('end', event => {
          if (!event.selection) return;
          const [[x0, y0], [x1, y1]] = event.selection;
          const subset = players.filter(d => {
            const cx = xScale(d.name);
            const cy = yScale(d[selectedMetric] ?? 0);
            return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
          });
          g.select('.brush').call(brush.clear);
          onBrushSelection(subset);
        });

      g.append('g')
        .attr('class', 'brush')
        .call(brush);
    }

    // Zoom
    const zoom = d3.zoom()
      .scaleExtent([1, 10])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on('zoom', event => {
        const { x, y, k } = event.transform;
        g.attr('transform', `translate(${margin.left + x}, ${margin.top + y}) scale(${k})`);
        g.selectAll('circle')
          .attr('r', d => rScale(d.contractValue) / k);
      });

    svg.call(zoom);

  }, [
    players,
    selectedMetric,
    selectedPlayer,
    brushMode,
    onBrushSelection,
    onSelectPlayer
  ]);

  return <svg ref={svgRef} className="w-full h-auto" />;
}

export default ScatterPlot;
