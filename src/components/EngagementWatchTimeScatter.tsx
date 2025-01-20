import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import type { ContentData } from '../types';

interface EngagementWatchTimeScatterProps {
  data: ContentData[];
}

export const EngagementWatchTimeScatter: React.FC<EngagementWatchTimeScatterProps> = ({ data }) => {
  // Processar os dados para calcular as métricas necessárias
  const processedData = data.map(item => {
    const watchTimePercentage = (item.avgWatchTime / item.totalVideoTime) * 100;
    const engagement = ((item.totalLikes + item.totalComments + item.totalShares + item.totalSaves) / item.totalViews) * 100;
    
    return {
      ...item,
      watchTimePercentage,
      engagement,
    };
  });

  const getPointColor = (item: ContentData) => {
    return item.totalViews > 400000 ? '#FF4D4D' : '#4D79FF';
  };

  const customShape = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={getPointColor(payload)}
        opacity={0.6}
      />
    );
  };

  const customTooltip = (props: any) => {
    const { active, payload } = props;
    
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded shadow-lg border">
          <p className="font-bold">{data.videoTitle}</p>
          <p>Engagement: {data.engagement.toFixed(2)}%</p>
          <p>Tempo Médio: {data.watchTimePercentage.toFixed(2)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Engagement vs Avg Watch Time (%)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="engagement" 
            type="number"
            name="Engagement"
            unit="%"
          >
            <Label value="Engagement (%)" position="bottom" offset={20} />
          </XAxis>
          <YAxis 
            dataKey="watchTimePercentage" 
            name="Avg Watch Time"
            unit="%"
          >
            <Label 
              value="Avg Watch Time (%)" 
              angle={-90} 
              position="left" 
              offset={20}
            />
          </YAxis>
          <Tooltip content={customTooltip} />
          <Scatter
            name="Videos"
            data={processedData}
            shape={customShape}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}; 