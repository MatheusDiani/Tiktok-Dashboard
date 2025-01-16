import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { OverviewData } from '../types';

interface TrendChartProps {
  data: OverviewData[];
  visibleMetrics: Record<string, boolean>;
  onToggleMetric: (metric: string) => void;
}

const METRICS = [
  { key: 'videoViews', color: '#FF4D4D', name: 'Video Views' },
  { key: 'profileViews', color: '#4D79FF', name: 'Profile Views' },
  { key: 'likes', color: '#FF4DFF', name: 'Likes' },
  { key: 'comments', color: '#4DFFB8', name: 'Comments' },
  { key: 'shares', color: '#FFB84D', name: 'Shares' },
];

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  visibleMetrics,
  onToggleMetric,
}) => {
  const handleLegendClick = (entry: any) => {
    const metric = METRICS.find(m => m.name === entry.value)?.key;
    if (metric) {
      onToggleMetric(metric);
    }
  };

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Trend Analysis</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend
            onClick={handleLegendClick}
            formatter={(value) => (
              <span
                className={`cursor-pointer ${
                  visibleMetrics[METRICS.find(m => m.name === value)?.key || '']
                    ? 'opacity-100'
                    : 'opacity-50'
                }`}
              >
                {value}
              </span>
            )}
          />
          {METRICS.map(
            ({ key, color, name }) =>
              visibleMetrics[key] && (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  name={name}
                  strokeWidth={2}
                />
              )
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}