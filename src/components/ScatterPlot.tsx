import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ContentData } from '../types';

interface ScatterPlotProps {
  data: ContentData[];
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  // Defina a cor de preenchimento com base nos dados
  const getFillColor = (entry: ContentData) => {
    return entry.totalViews > 10000 ? '#FF4D4D' : '#4D79FF';
  };

  const customShape = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5} // Tamanho do círculo
        fill={getFillColor(payload as ContentData)}
      />
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded shadow-lg border">
        <p className="font-bold mb-2">{data.videoTitle}</p>
        <p>Duration: {data.totalVideoTime}s</p>
        <p>Views: {data.totalViews.toLocaleString()}</p>
      </div>
    );
  };

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Video Duration vs Total Views</h2>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="totalVideoTime"
            name="Video Duration"
            unit="s"
            type="number"
          />
          <YAxis 
            dataKey="totalViews" 
            name="Total Views"
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            name="Videos"
            data={data}
            fill="#4D79FF" // Cor padrão
            shape={customShape} // Função customizada para forma
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}