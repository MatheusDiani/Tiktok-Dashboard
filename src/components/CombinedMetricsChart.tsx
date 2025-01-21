import React, { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import type { ContentData } from '../types';

interface CombinedMetricsChartProps {
  data: ContentData[];
  tagCombinations: Array<{
    id: number;
    tags: string[];
    label: string;
  }>;
}

export const CombinedMetricsChart: React.FC<CombinedMetricsChartProps> = ({
  data,
  tagCombinations,
}) => {
  const chartData = useMemo(() => {
    return tagCombinations.map(combination => {
      // Filtrar vídeos para esta combinação de tags
      const categoryData = data.filter(item => {
        const itemTags = new Set([
          item.tags1?.toLowerCase().trim(),
          item.tags2?.toLowerCase().trim()
        ].filter(Boolean));
        
        return combination.tags.every(tag => 
          itemTags.has(tag.toLowerCase().trim())
        );
      });

      // Calcular média do tempo de visualização
      const avgWatchTimePercentage = categoryData.length > 0
        ? categoryData.reduce((sum, item) => 
            sum + (item.avgWatchTime / item.totalVideoTime) * 100, 
          0) / categoryData.length
        : 0;

      // Calcular soma total de novos seguidores
      const totalNewFollowers = categoryData.reduce(
        (sum, item) => sum + item.newFollowers,
        0
      );

      return {
        category: combination.label,
        avgWatchTimePercentage: Number(avgWatchTimePercentage.toFixed(2)),
        totalNewFollowers: totalNewFollowers,
        videoCount: categoryData.length,
      };
    });
  }, [data, tagCombinations]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded shadow-lg border">
        <p className="font-bold mb-2">{label}</p>
        <p>Avg Watch Time: {data.avgWatchTimePercentage.toFixed(2)}%</p>
        <p>Total New Followers: {data.totalNewFollowers.toLocaleString()}</p>
        <p className="text-sm text-gray-500">
          Based on {data.videoCount} videos
        </p>
      </div>
    );
  };

  return (
    <div className="w-full h-[500px] bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">
        Average Watch Time & Total New Followers by Tag Combinations
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 50, left: 50, bottom: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="category"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={100}
            tickMargin={30}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#8884d8"
          >
            <Label
              value="Avg Watch Time (%)"
              angle={-90}
              position="insideLeft"
              offset={-5}
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#82ca9d"
          >
            <Label
              value="Total New Followers"
              angle={90}
              position="insideRight"
              offset={-5}
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Bar
            yAxisId="left"
            dataKey="avgWatchTimePercentage"
            name="Avg Watch Time %"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="totalNewFollowers"
            name="Total New Followers"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}; 