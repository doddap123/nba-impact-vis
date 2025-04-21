// src/components/RadarChart.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function RadarChart({ player, players }) {
  const svgRef = useRef();

  useEffect(() => {
    const metrics = ['points','rebounds','assists','fgPct','tsPct'];
    const labels  = { points:'Points', rebounds:'Rebounds', assists:'Assists', fgPct:'FG%', tsPct:'TS%' };

    const domain = metrics.map(m=>({
      key: m,
      min: d3.min(players,p=>p[m]),
      max: d3.max(players,p=>p[m])
    }));
    const data = metrics.map((m,i)=>{
      const {min,max} = domain.find(d=>d.key===m);
      const v = Number(player[m])||0;
      return { axis: labels[m], value: (v-min)/(max-min) };
    });

    const size=360, levels=5, radius=(size/2)*0.8, angle=(Math.PI*2)/metrics.length;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width',size).attr('height',size);

    const g=svg.append('g').attr('transform',`translate(${size/2},${size/2})`);

    // grid
    for(let lvl=1;lvl<=levels;lvl++){
      g.append('circle')
        .attr('r', (radius*lvl)/levels)
        .attr('fill','none').attr('stroke','var(--grid)');
    }
    // axes
    const axis = g.selectAll('.axis').data(metrics).enter().append('g').attr('class','axis');
    axis.append('line')
      .attr('x1',0).attr('y1',0)
      .attr('x2',(d,i)=>radius*Math.cos(angle*i-Math.PI/2))
      .attr('y2',(d,i)=>radius*Math.sin(angle*i-Math.PI/2))
      .attr('stroke','var(--axis)');
    axis.append('text')
      .attr('x',(d,i)=>(radius+10)*Math.cos(angle*i-Math.PI/2))
      .attr('y',(d,i)=>(radius+10)*Math.sin(angle*i-Math.PI/2))
      .attr('text-anchor','middle')
      .style('fill','var(--text)')
      .text(d=>labels[d]);

    // radar
    const radarLine = d3.lineRadial()
      .radius(d=>d.value*radius)
      .angle((d,i)=>i*angle)
      .curve(d3.curveLinearClosed);

    g.append('path')
      .datum(data)
      .attr('d', radarLine)
      .attr('fill','var(--accent)')
      .attr('fill-opacity',0.4)
      .attr('stroke','var(--accent)')
      .attr('stroke-width',2);
  }, [player,players]);

  return <svg ref={svgRef} className="block mx-auto" />;
}

export default RadarChart;
