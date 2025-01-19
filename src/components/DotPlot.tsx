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
  // Ajuste aqui caso seus dados tenham mais campos
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
}

interface TagCombination {
  id: number;
  tags: string[];
  label: string;
}

const AVAILABLE_TAGS = [
  'heroi',
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
] as const;

export const DotPlot: React.FC<DotPlotProps> = ({ data }) => {
  const [tagCombinations, setTagCombinations] = useState<TagCombination[]>([
    { id: 1, tags: ['heroi', 'marvel'], label: 'heroi + marvel' },
  ]);
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

    const newId = Math.max(0, ...tagCombinations.map((c) => c.id)) + 1;
    const label = selectedTags.join(' + ');

    setTagCombinations((prev) => [
      ...prev,
      { id: newId, tags: [...selectedTags], label },
    ]);

    setSelectedTags([]);
  };

  const removeCombination = (id: number) => {
    setTagCombinations((prev) => prev.filter((c) => c.id !== id));
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
      </div>

      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 50, left: 50, bottom: 120 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="categoryIndex"
              // Garante que o eixo vai de -0.5 até (n - 0.5),
              // permitindo que cada índice fique centralizado
              domain={[-0.5, tagCombinations.length - 0.5]}
              // Força o eixo a exibir todos os índices inteiros
              ticks={tagCombinations.map((_, i) => i)}
              // Mostra a label correta para cada índice
              tickFormatter={(value) => {
                const combo = tagCombinations[value];
                return combo ? combo.label : '';
              }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={120}
              tickMargin={45}
              tick={{
                fontSize: 14,
                width: 120,
                fill: '#333',
                fontWeight: 500,
              }}
            >
              <Label
                value="Tag Combinations"
                offset={-80}
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
              fill="#4D79FF"
              shape="circle"
              r={6}
              opacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
