// File: src/components/ScatterPlot.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function ScatterPlot({
  players,
  selectedMetric,
  selectedMetricLabel,
  selectedPlayer,
  brushMode,
  onBrushSelection,
  onSelectPlayer
}) {
  const svgRef = useRef();

  useEffect(() => {
    // Clear SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Dimensions & margins
    const width  = 700;
    const height = 400;
    const margin = { top: 60, right: 40, bottom: 50, left: 50 };
    const innerWidth  = width  - margin.left - margin.right;
    const innerHeight = height - margin.top  - margin.bottom;

    // Container group
    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Chart title
    svg.append('text')
      .attr('x',  width/2)
      .attr('y',  30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', '600')
      .attr('fill', '#1f2937')
      .text(`${selectedMetricLabel} Effectiveness Distribution`);

    // Scales
    const values = players.map(p => p[selectedMetric] ?? 0);
    const absMax = d3.max(values.map(v => Math.abs(v))) || 1;
    const xScale = d3.scalePoint()
      .domain(players.map(p => p.name))
      .range([0, innerWidth])
      .padding(0.7);
    const yScale = d3.scaleLinear()
      .domain([-absMax, absMax])
      .range([innerHeight, 0]);
    const rScale = d3.scaleSqrt()
      .domain([0, d3.max(players, p => p.contractValue)])
      .range([6, 22]);

    // Zero-axis line
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#d1d5db')
      .attr('stroke-width', 1);

    // Tooltip container
    const tooltip = d3.select(svgRef.current.parentNode)
      .selectAll('.tooltip')
      .data([0])
      .join('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('color', '#111827')
      .style('padding', '8px 12px')
      .style('border', '1px solid #e5e7eb')
      .style('border-radius', '6px')
      .style('box-shadow', '0 2px 8px rgba(0,0,0,0.08)')
      .style('font-size','13px')
      .style('pointer-events','none')
      .style('opacity',0);

    // Draw points
    g.selectAll('circle')
      .data(players)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.name))
      .attr('cy', d => yScale(d[selectedMetric] ?? 0))
      .attr('r',  d => rScale(d.contractValue))
      .attr('fill', d =>
        d.name === selectedPlayer.name ? '#f59e0b' : '#3b82f6'
      )
      .attr('opacity', 0.8)
      .attr('stroke', d =>
        d.name === selectedPlayer.name ? '#d97706' : 'none'
      )
      .attr('stroke-width', d =>
        d.name === selectedPlayer.name ? 2 : 0
      )
      .on('mouseover', function(event, d) {
        tooltip.style('opacity',1)
          .html(`
            <strong>${d.name}</strong><br/>
            ${selectedMetricLabel}: ${d[selectedMetric] >= 0 ? '+' : ''}${(d[selectedMetric] ?? 0).toFixed(2)}<br/>
            Contract: $${(d.contractValue/1e6).toFixed(1)}M
          `);
      })
      .on('mousemove', function(event) {
        tooltip.style('left',  event.pageX + 12 + 'px')
               .style('top',   event.pageY - 32 + 'px');
      })
      .on('mouseout', function() {
        tooltip.style('opacity',0);
      })
      .on('click', function(event, d) {
        onSelectPlayer(d);
      });

    // Y-axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-size','12px')
      .style('fill','#4b5563');

    // Y-axis label
    g.append('text')
      .attr('transform','rotate(-90)')
      .attr('y', -margin.left + 12)
      .attr('x', -innerHeight/2)
      .attr('dy','-1.5em')
      .attr('text-anchor','middle')
      .attr('fill','#374151')
      .attr('font-size','13px')
      .text(`${selectedMetricLabel} Effectiveness`);

    // Brush (only when brushMode is on)
    if (brushMode) {
      const brush = d3.brush()
        .extent([[0,0],[innerWidth,innerHeight]])
        .on('end', event => {
          if (!event.selection) return;
          const [[x0,y0],[x1,y1]] = event.selection;
          const subset = players.filter(d => {
            const cx = xScale(d.name);
            const cy = yScale(d[selectedMetric] ?? 0);
            return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
          });
          // Clear brush and send subset up
          g.select('.brush').call(brush.clear);
          onBrushSelection(subset);
        });

      g.append('g')
        .attr('class','brush')
        .call(brush);
    }

  }, [
    players,
    selectedMetric,
    selectedMetricLabel,
    selectedPlayer,
    brushMode,
    onBrushSelection,
    onSelectPlayer
  ]);

  return (
    <svg ref={svgRef} className="w-full h-auto" />
  );
}

export default ScatterPlot;
