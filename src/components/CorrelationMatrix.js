import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function CorrelationMatrix({ players }) {
  const svgRef     = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    // efgPct removed here as well
    const metrics = ['points','rebounds','assists','fgPct','threePct','tsPct','combined'];
    const n = metrics.length;

    // Pearson helper
    function pearson(a, b) {
      const meanA = d3.mean(a), meanB = d3.mean(b);
      const cov   = d3.sum(a.map((v,i)=>(v-meanA)*(b[i]-meanB)));
      const sdA   = Math.sqrt(d3.sum(a.map(v=>Math.pow(v-meanA,2))));
      const sdB   = Math.sqrt(d3.sum(b.map(v=>Math.pow(v-meanB,2))));
      return cov / (sdA * sdB);
    }

    // flatten
    const data = [];
    metrics.forEach((m1, i) =>
      metrics.forEach((m2, j) => {
        const arr1 = players.map(p => p[m1]);
        const arr2 = players.map(p => p[m2]);
        data.push({
          x: j, y: i,
          value: pearson(arr1, arr2),
          label1: m1, label2: m2
        });
      })
    );

    const cell       = 50;
    const matrixSize = n * cell;
    const labelSpace = 100;
    const fullSize   = matrixSize + labelSpace + 20;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${fullSize} ${fullSize}`)
      .attr('preserveAspectRatio','xMidYMid meet');

    const g = svg.append('g')
      .attr('transform', `translate(${labelSpace},${labelSpace})`);

    const colorScale = d3.scaleSequential()
      .domain([-1,1])
      .interpolator(d3.interpolateRdBu);

    // cells
    g.selectAll('rect')
      .data(data)
      .enter().append('rect')
      .attr('x', d => d.x * cell)
      .attr('y', d => d.y * cell)
      .attr('width', cell)
      .attr('height', cell)
      .attr('fill', d => colorScale(d.value))
      .on('mouseover', (event, d) => {
        const tip = d3.select(tooltipRef.current);
        tip
          .style('opacity', 1)
          .html(`
            <strong>${d.label1}</strong> vs <strong>${d.label2}</strong><br/>
            Corr: <strong>${d.value.toFixed(2)}</strong>
          `)
          .style('left', event.offsetX + 15 + 'px')
          .style('top', event.offsetY - 10 + 'px');

      })
      .on('mouseout', () => {
        d3.select(tooltipRef.current).style('opacity', 0);
      });

    // row labels
    g.append('g').selectAll('text')
      .data(metrics)
      .enter().append('text')
      .attr('x', -6)
      .attr('y', (d,i) => i * cell + cell/2)
      .attr('dy','0.35em')
      .attr('text-anchor','end')
      .style('fill','#e5e7eb')
      .style('font-size','11px')
      .text(d => d);

    // col labels (rotated + shifted)
    g.append('g').selectAll('text')
      .data(metrics)
      .enter().append('text')
      .attr('x', (d,i) => i * cell + cell/2 + 20)
      .attr('y', -10)
      .attr('y', -30)
        .attr('transform', (d, i) =>
        `rotate(-45, ${i * cell + cell / 2}, -30)`
        )

      .attr('text-anchor','end')
      .style('fill','#e5e7eb')
      .style('font-size','11px')
      .text(d => d);

  }, [players]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full h-auto" />
      <div
        ref={tooltipRef}
        className="tooltip absolute bg-gray-900 text-white text-sm px-2 py-1 rounded shadow"
        style={{ opacity: 0, pointerEvents: 'none', zIndex: 50 }}
      />
    </div>
  );
}

export default CorrelationMatrix;
