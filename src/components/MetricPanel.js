import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const MetricPanel = () => (
  <div className="bg-white p-4 rounded shadow max-w-xs">
    <h4 className="font-semibold mb-2">Custom Metric</h4>
    <MathJaxContext>
      <MathJax>
        {`\\( Impact = PTS + 1.2\\cdot REB + 1.5\\cdot AST + 3(STL + BLK) - TO + 10\\cdot TS\\% + \\\\frac{Salary}{20M} \\)`}
      </MathJax>
    </MathJaxContext>
  </div>
);

export default MetricPanel;