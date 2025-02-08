import React, { useState, useMemo } from 'react';
import {
  ScatterChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  Label,
} from 'recharts';

interface ContentData {
  videoTitle: string;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  totalViews: number;
  tags1?: string;
  tags2?: string;
}

interface DotPlotProps {
  data: ContentData[];
  tagCombinations: Array<{
    id: number;
    tags: string[];
    label: string;
  }>;
  onTagCombinationsChange: (combinations: Array<{
    id: number;
    tags: string[];
    label: string;
  }>) => void;
}


const AVAILABLE_TAGS = [
  'fantasia',
  'famoso',
  'dc',
  'marvel',
  'futurista',
  'medieval',
  'animal',
  'games',
  'carro',
  'mitologia',
  'fusao',
  'sem tag',
  'anime',
  'filme',
] as const;

export const DotPlot: React.FC<DotPlotProps> = ({
  data,
  tagCombinations,
  onTagCombinationsChange
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Função para calcular o engajamento
  const calculateEngagement = (item: ContentData) => {
    return (
      ((item.totalLikes +
        item.totalComments +
        item.totalShares +
        item.totalSaves) /
        item.totalViews) *
      100
    );
  };

  // Processar dados para o scatter plot
  const scatterData = useMemo(() => {
    return tagCombinations
      .map((combination, index) => {
        const categoryData = data.filter((item) => {
          // Monta um set com as tags do item
          const itemTags = new Set(
            [item.tags1?.toLowerCase().trim(), item.tags2?.toLowerCase().trim()]
              .filter(Boolean)
          );
          // Verifica se todas as tags da combination estão no item
          return combination.tags.every((tag) =>
            itemTags.has(tag.toLowerCase().trim())
          );
        });

        // Mapeia para o formato esperado pelo ScatterChart
        return categoryData.map((item) => ({
          categoryIndex: index, // índice da combinação
          categoryName: combination.label,
          engagement: calculateEngagement(item),
          videoTitle: item.videoTitle,
          views: item.totalViews,
          likes: item.totalLikes,
          comments: item.totalComments,
          shares: item.totalShares,
          saves: item.totalSaves,
        }));
      })
      .flat();
  }, [data, tagCombinations]);

  const addCombination = () => {
    if (selectedTags.length === 0) return;

    const newId = Math.max(0, ...tagCombinations.map(c => c.id)) + 1;
    const label = selectedTags.join(' + ');

    onTagCombinationsChange([
      ...tagCombinations,
      { id: newId, tags: [...selectedTags], label }
    ]);

    setSelectedTags([]);
  };

  const removeCombination = (id: number) => {
    onTagCombinationsChange(tagCombinations.filter(c => c.id !== id));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded shadow-lg border">
        <p className="font-bold">{item.videoTitle}</p>
        <p>Category: {item.categoryName}</p>
        <p>Engagement: {item.engagement.toFixed(2)}%</p>
        <p>Views: {item.views.toLocaleString()}</p>
        <p>Likes: {item.likes.toLocaleString()}</p>
        <p>Comments: {item.comments.toLocaleString()}</p>
        <p>Shares: {item.shares.toLocaleString()}</p>
        <p>Saves: {item.saves.toLocaleString()}</p>
      </div>
    );
  };

  // Calcular médias de engajamento por categoria
  const categoryAverages = useMemo(() => {
    return tagCombinations.map(combination => {
      const categoryData = data.filter(item => {
        const itemTags = new Set([
          item.tags1?.toLowerCase().trim(),
          item.tags2?.toLowerCase().trim()
        ].filter(Boolean));
        
        return combination.tags.every(tag => 
          itemTags.has(tag.toLowerCase().trim())
        );
      });

      const engagements = categoryData.map(calculateEngagement);
      const average = engagements.length > 0
        ? engagements.reduce((sum, eng) => sum + eng, 0) / engagements.length
        : 0;

      return {
        category: combination.label,
        average,
        count: categoryData.length
      };
    });
  }, [data, tagCombinations]);

  // Componente para mostrar as médias
  const AveragesDisplay = () => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Average Engagement by Category:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryAverages.map((cat, index) => (
          <div 
            key={index}
            className="bg-gray-50 p-3 rounded-lg border border-gray-200"
          >
            <p className="font-medium text-gray-800">{cat.category}</p>
            <p className="text-sm text-gray-600">
              Average: {cat.average.toFixed(2)}%
              <span className="ml-2 text-gray-500">
                (from {cat.count} videos)
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const getPointColor = (item: any) => {
    return item.views > 400000 ? '#FF4D4D' : '#4D79FF';
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

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Engagement Distribution by Tag Combinations</h2>

        {/* Tag Selection */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {AVAILABLE_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  } hover:opacity-80`}
              >
                {tag}
              </button>
            ))}
          </div>
          <button
            onClick={addCombination}
            disabled={selectedTags.length === 0}
            className={`px-4 py-2 rounded-md text-sm font-medium 
              ${
                selectedTags.length > 0
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            Add Combination
          </button>
        </div>

        {/* Active Combinations */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tagCombinations.map((combination) => (
            <div
              key={combination.id}
              className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full"
            >
              <span className="text-sm">{combination.label}</span>
              <button
                onClick={() => removeCombination(combination.id)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Adicionar o display de médias aqui */}
        <AveragesDisplay />
      </div>

      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 50, left: 50, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="categoryIndex"
              domain={[-0.5, tagCombinations.length - 0.5]}
              ticks={tagCombinations.map((_, i) => i)}
              tickFormatter={(value) => {
                const combo = tagCombinations[value];
                return combo ? combo.label : '';
              }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
              tickMargin={30}
              tick={{
                fontSize: 14,
                width: 120,
                fill: '#333',
                fontWeight: 500,
              }}
            >
              <Label
                value="Tag Combinations"
                offset={-50}
                position="insideBottom"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
            </XAxis>

            <YAxis
              dataKey="engagement"
              name="Engagement"
              unit="%"
              tick={{
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              <Label
                value="Engagement (%)"
                angle={-90}
                position="insideLeft"
                offset={10}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
            </YAxis>

            <Tooltip content={<CustomTooltip />} />

            <Scatter
              name="Videos"
              data={scatterData}
              shape={customShape}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
