import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function RadarChart({ player, players }) {
  const svgRef = useRef();
  useEffect(() => {
    const metrics = ['points', 'rebounds', 'assists', 'fgPct', 'efgPct', 'tsPct'];
    const labels = { points: 'Points', rebounds: 'Rebounds', assists: 'Assists', fgPct: 'FG%', efgPct: 'eFG%', tsPct: 'TS%' };

    const domain = metrics.map(m => ({
      key: m,
      min: d3.min(players, p => p[m]),
      max: d3.max(players, p => p[m])
    }));

    const data = metrics.map(m => {
      const d0 = domain.find(d => d.key === m);
      const val = player[m];
      const norm = (val - d0.min) / (d0.max - d0.min);
      return { axis: labels[m], value: norm };
    });

    const size = 360;
    const levels = 5;
    const radius = size / 2 * 0.8;
    const angleSlice = (Math.PI * 2) / metrics.length;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', size).attr('height', size);

    const g = svg.append('g').attr('transform', `translate(${size/2},${size/2})`);

    // Draw grid
    for (let lvl = 0; lvl < levels; lvl++) {
      const r = radius * ((lvl + 1) / levels);
      g.append('circle')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', '#ddd');
    }

    // Axes
    const axis = g.selectAll('.axis')
      .data(metrics)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axis.append('line')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', (d, i) => radius * Math.cos(angleSlice * i - Math.PI/2))
      .attr('y2', (d, i) => radius * Math.sin(angleSlice * i - Math.PI/2))
      .attr('stroke', '#999');

    axis.append('text')
      .attr('x', (d, i) => (radius + 10) * Math.cos(angleSlice * i - Math.PI/2))
      .attr('y', (d, i) => (radius + 10) * Math.sin(angleSlice * i - Math.PI/2))
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#333')
      .text((d) => labels[d]);

    // Radar area
    const radarLine = d3.lineRadial()
      .radius(d => d.value * radius)
      .angle((d,i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    g.append('path')
      .datum(data)
      .attr('d', radarLine)
      .attr('fill', '#3b82f6')
      .attr('fill-opacity', 0.4)
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2);

  }, [player, players]);

  return <svg ref={svgRef} className="block mx-auto" />;
}

export default RadarChart;