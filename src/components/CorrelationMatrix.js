import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function CorrelationMatrix({ players }) {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const metrics = ['points', 'rebounds', 'assists', 'fgPct', 'threePct', 'tsPct', 'combined'];
    const labelMap = {
      points: 'Points',
      rebounds: 'Rebounds',
      assists: 'Assists',
      fgPct: 'FG%',
      threePct: '3PT%',
      tsPct: 'TS%',
      combined: 'CRAFT'
    };

    const n = metrics.length;

    function pearson(a, b) {
      const meanA = d3.mean(a), meanB = d3.mean(b);
      const cov = d3.sum(a.map((v, i) => (v - meanA) * (b[i] - meanB)));
      const sdA = Math.sqrt(d3.sum(a.map(v => Math.pow(v - meanA, 2))));
      const sdB = Math.sqrt(d3.sum(b.map(v => Math.pow(v - meanB, 2))));
      return cov / (sdA * sdB);
    }

    const data = [];
    metrics.forEach((m1, i) =>
      metrics.forEach((m2, j) => {
        const arr1 = players.map(p => p[m1]);
        const arr2 = players.map(p => p[m2]);
        data.push({
          x: j,
          y: i,
          value: pearson(arr1, arr2),
          label1: labelMap[m1],
          label2: labelMap[m2]
        });
      })
    );

    const cell = 50;
    const matrixSize = n * cell;
    const labelSpace = 100;
    const legendHeight = 10;
    const extraBottom = 100; // extra padding for legend
    const fullSize = matrixSize + labelSpace + extraBottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${fullSize} ${fullSize}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
      .attr('transform', `translate(${labelSpace},${labelSpace})`);

    const colorScale = d3.scaleSequential()
      .domain([-1, 1])
      .interpolator(d3.interpolateBrBG);

    g.selectAll('rect')
      .data(data)
      .enter().append('rect')
      .attr('x', d => d.x * cell)
      .attr('y', d => d.y * cell)
      .attr('width', cell)
      .attr('height', cell)
      .attr('fill', d => colorScale(d.value))
      .attr('stroke', '#2F3E46')
      .on('mouseover', (event, d) => {
        const bounds = svgRef.current.getBoundingClientRect();
        const tip = d3.select(tooltipRef.current);
        tip
          .style('opacity', 1)
          .html(`
            <strong>${d.label1}</strong> vs <strong>${d.label2}</strong><br/>
            Corr: <strong>${d.value.toFixed(2)}</strong>
          `)
          .style('left', `${event.clientX - bounds.left + 8}px`)
          .style('top', `${event.clientY - bounds.top - 28}px`);
      })
      .on('mouseout', () => {
        d3.select(tooltipRef.current).style('opacity', 0);
      });

    // Row labels
    g.append('g').selectAll('text')
      .data(metrics)
      .enter().append('text')
      .attr('x', -6)
      .attr('y', (d, i) => i * cell + cell / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .style('fill', 'var(--text)')
      .style('font-size', '12px')
      .text(d => labelMap[d]);

    // Column labels
    g.append('g').selectAll('text')
      .data(metrics)
      .enter().append('text')
      .attr('x', (d, i) => i * cell + cell / 2 + 20)
      .attr('y', -30)
        .attr('transform', (d, i) =>
        `rotate(-45, ${i * cell + cell / 2}, -30)`
        )

      .attr('text-anchor', 'end')
      .style('fill', 'var(--text)')
      .style('font-size', '12px')
      .text(d => labelMap[d]);

    // === LEGEND ===
    const legendWidth = 200;
    const legendX = matrixSize / 2 - legendWidth / 2;
    const legendY = matrixSize + 50;

    const defs = svg.append('defs');
    const gradientId = 'correlation-gradient';

    const gradient = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%').attr('x2', '100%')
      .attr('y1', '0%').attr('y2', '0%');

    const stops = d3.range(0, 1.01, 0.01);
    stops.forEach(t => {
      gradient.append('stop')
        .attr('offset', `${t * 100}%`)
        .attr('stop-color', d3.interpolateBrBG(t));
    });

    const legendScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([0, legendWidth]);

    svg.append('text')
      .attr('x', labelSpace + legendX + legendWidth / 2)
      .attr('y', labelSpace + legendY - 10)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--text)')
      .style('font-size', '12px')
      .text('Correlation Scale');

    svg.append('rect')
      .attr('x', labelSpace + legendX)
      .attr('y', labelSpace + legendY)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', `url(#${gradientId})`)
      .style('stroke', '#444');

    svg.append('g')
      .attr('transform', `translate(${labelSpace + legendX}, ${labelSpace + legendY + legendHeight})`)
      .call(d3.axisBottom(legendScale).ticks(5).tickFormat(d3.format(".1f")))
      .selectAll('text')
      .style('fill', 'var(--text)')
      .style('font-size', '11px');

  }, [players]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full h-auto" />
      <div
        ref={tooltipRef}
        className="tooltip absolute bg-gray-900 text-white text-sm px-2 py-1 rounded shadow"
        style={{
          opacity: 0,
          pointerEvents: 'none',
          position: 'absolute',
          zIndex: 50
        }}
      />
    </div>
  );
}

export default CorrelationMatrix;
