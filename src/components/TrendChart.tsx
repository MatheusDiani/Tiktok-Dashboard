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

const metricConfig = {
  videoViews: {
    label: 'Video Views',
    color: '#4D79FF',
    activeClass: 'bg-blue-500',
  },
  profileViews: {
    label: 'Profile Views',
    color: '#FF4D4D',
    activeClass: 'bg-red-500',
  },
  likes: {
    label: 'Likes',
    color: '#4DFF4D',
    activeClass: 'bg-green-500',
  },
  comments: {
    label: 'Comments',
    color: '#FFD700',
    activeClass: 'bg-yellow-500',
  },
  shares: {
    label: 'Shares',
    color: '#FF4DFF',
    activeClass: 'bg-purple-500',
  },
};

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  visibleMetrics,
  onToggleMetric,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Trend Overview</h2>
        <div className="flex gap-4">
          {Object.entries(metricConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => onToggleMetric(key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${
                  visibleMetrics[key]
                    ? `${config.activeClass} text-white`
                    : 'bg-gray-200 text-gray-600'
                } hover:opacity-80`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.entries(metricConfig).map(([key, config]) => (
            visibleMetrics[key] && (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={config.label}
                stroke={config.color}
                strokeWidth={2}
                dot={false}
              />
            )
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};