import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterPlot = ({ data }) => {
  const svgRef = useRef();
  const width = 700, height = 300;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.stat) + 5])
      .range([50, width - 50]);

    const rScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.salary)])
      .range([5, 20]);

    svg.append("g")
      .attr("transform", `translate(0, ${height / 2})`)
      .call(d3.axisBottom(xScale));

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.stat))
      .attr("cy", height / 2)
      .attr("r", d => rScale(d.salary))
      .attr("fill", "#3b82f6")
      .attr("opacity", 0.7)
      .append("title")
      .text(d => `${d.name}\nStat: ${d.stat}\nSalary: $${d.salary.toLocaleString()}`);
  }, [data]);

  return (
    <svg ref={svgRef} width={width} height={height} className="border rounded shadow" />
  );
};

export default ScatterPlot;
