import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SystemMetrics } from '../api/metrics';

interface MetricsChartProps {
  metrics: SystemMetrics[];
}

const MetricsChart: React.FC<MetricsChartProps> = ({ metrics }) => {
  const data = metrics.map((m, index) => ({
    name: `Check ${index + 1}`,
    latency: m.latency,
    errorRate: m.errorRate,
  }));

  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="latency" stroke="#8884d8" />
      <Line type="monotone" dataKey="errorRate" stroke="#82ca9d" />
    </LineChart>
  );
};

export default MetricsChart;