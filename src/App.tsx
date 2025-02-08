import { useState, useEffect, useCallback, useMemo } from 'react';
import * as d3 from 'd3'; // Biblioteca para carregar CSVs
import { TrendChart } from './components/TrendChart';
import { ContentTable } from './components/ContentTable';
import { ScatterPlot } from './components/ScatterPlot';
import { Filters } from './components/Filters';
import { LayoutGrid } from 'lucide-react';
import { EngagementWatchTimeScatter } from './components/EngagementWatchTimeScatter';
import { DotPlot } from './components/DotPlot';
import { CombinedMetricsChart } from './components/CombinedMetricsChart';
import { format } from 'date-fns'; // Adicionar imports do date-fns

// Tipos para os dados
type OverviewData = {
  date: string;
  videoViews: number;
  profileViews: number;
  likes: number;
  comments: number;
  shares: number;
};

type ContentData = {
  postDay: string;
  videoTitle: string;
  totalVideoTime: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  avgWatchTime: number;
  fullWatchPercentage: number;
  newFollowers: number;
  tags1: string;
  tags2: string;
};

// Atualizar função de conversão de data
function convertDate(dateStr: string): Date {
  try {
    // Parse a data no formato dd/MM/yy para um objeto Date
    const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
    const fullYear = year < 100 ? 2000 + year : year;
    return new Date(fullYear, month - 1, day);
  } catch (error) {
    console.error('Erro ao converter data:', dateStr, error);
    return new Date();
  }
}

function App() {
  const [overviewData, setOverviewData] = useState<OverviewData[]>([]);
  const [contentData, setContentData] = useState<ContentData[]>([]);

  const [visibleMetrics, setVisibleMetrics] = useState<Record<string, boolean>>({
    videoViews: true,
    profileViews: true,
    likes: true,
    comments: true,
    shares: true,
  });

  const [dateRange, setDateRange] = useState({
    start: '2024-09-09',
    end: '2024-12-26',
  });

  const [viewsRange, setViewsRange] = useState({
    min: 0,
    max: 1500000,
  });

  // Adicionar ref para o DotPlot

  // Adicionar estado para as combinações de tags
  const [tagCombinations, setTagCombinations] = useState<Array<{
    id: number;
    tags: string[];
    label: string;
  }>>([
    { id: 1, tags: ['marvel', 'dc'], label: 'marvel + dc' }
  ]);

  const toggleMetric = (metric: string) => {
    setVisibleMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  // Função para filtrar dados baseado nas combinações de tags

  // Aplicar ambos os filtros (data/views e tags)
  const filteredContentData = useMemo(() => {
    return contentData.filter((item) => {
      try {
        const itemDate = new Date(item.postDay);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);

        return (
          itemDate >= startDate && 
          itemDate <= endDate && 
          item.totalViews >= viewsRange.min && 
          item.totalViews <= viewsRange.max
        );
      } catch (error) {
        return false;
      }
    });
  }, [contentData, dateRange, viewsRange]);

  // Filtrar dados do Overview
  const filteredOverviewData = useMemo(() => {
    return overviewData.filter((item) => {
      try {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);

        return itemDate >= startDate && itemDate <= endDate;
      } catch (error) {
        return false;
      }
    });
  }, [overviewData, dateRange]);

  useEffect(() => {
    // Carregar e mapear Overview.csv
    d3.csv('/Overview.csv', (row) => ({
      date: row.Date || '',
      videoViews: Number(row['Video Views'] || 0),
      profileViews: Number(row['Profile Views'] || 0),
      likes: Number(row.Likes || 0),
      comments: Number(row.Comments || 0),
      shares: Number(row.Shares || 0),
    }))
      .then((data) => {
        setOverviewData(data as OverviewData[]);
      })
      .catch((error) => console.error('Erro ao carregar Overview.csv:', error));

    // Carregar e mapear Content.csv
    d3.csv('/Content.csv')
      .then((rawData) => {
        const processedData = rawData.map(row => {
          // Converter a data para o formato correto
          const date = convertDate(row['Post day']);
          return {
            postDay: format(date, 'yyyy-MM-dd'),
            videoTitle: row['Video title'] || '',
            totalVideoTime: parseFloat(row['Total video time'] || '0'),
            totalViews: parseInt(row['Total views']?.replace(/,/g, '') || '0', 10),
            totalLikes: parseInt(row['Total likes']?.replace(/,/g, '') || '0', 10),
            totalComments: parseInt(row['Total comments']?.replace(/,/g, '') || '0', 10),
            totalShares: parseInt(row['Total shares']?.replace(/,/g, '') || '0', 10),
            totalSaves: parseInt(row['Total saves']?.replace(/,/g, '') || '0', 10),
            avgWatchTime: parseFloat(row['Avg watch time'] || '0'),
            fullWatchPercentage: parseFloat((row['Full watch percentage'] || '0').replace('%', '')),
            newFollowers: parseInt(row['New followers']?.replace(/,/g, '') || '0', 10),
            tags1: row['Tags1']?.toLowerCase().trim() || '',
            tags2: row['Tags2']?.toLowerCase().trim() || '',
          };
        });

        setContentData(processedData);
      })
      .catch((error) => console.error('Erro ao carregar Content.csv:', error));
  }, []);

  useEffect(() => {
    console.log({
      'Total de registros no CSV': contentData.length,
      'Registros após filtro': filteredContentData.length,
      'Primeiro registro': contentData[0],
      'Último registro': contentData[contentData.length - 1],
      'Range de datas atual': dateRange,
      'Range de views atual': viewsRange,
    });
  }, [contentData, filteredContentData, dateRange, viewsRange]);

  // Adicionar log para dados filtrados
  useEffect(() => {
    console.log('Dados filtrados:', {
      total: filteredContentData.length,
      amostra: filteredContentData.slice(0, 3)
    });
  }, [filteredContentData]);

  console.log('Filtered Content Data for ScatterPlot:', filteredContentData);

  // Função para atualizar as combinações de tags
  const updateTagCombinations = useCallback((newCombinations: typeof tagCombinations) => {
    setTagCombinations(newCombinations);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <LayoutGrid className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              TikTok Analytics Dashboard
            </h1>
          </div>
        </header>

        <Filters
          dateRange={dateRange}
          viewsRange={viewsRange}
          onDateRangeChange={setDateRange}
          onViewsRangeChange={setViewsRange}
        />

        <div className="space-y-6">
          <TrendChart
            data={filteredOverviewData} // Usar os dados filtrados ao invés de overviewData
            visibleMetrics={visibleMetrics}
            onToggleMetric={toggleMetric}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <ScatterPlot data={filteredContentData} />
            <EngagementWatchTimeScatter data={filteredContentData} />
          </div>

          <div className="mt-6">
            <DotPlot 
              data={filteredContentData}
              tagCombinations={tagCombinations}
              onTagCombinationsChange={updateTagCombinations}
            />
          </div>

          <div className="mt-6">
            <CombinedMetricsChart 
              data={filteredContentData}
              tagCombinations={tagCombinations}
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 mt-6">
            <h2 className="text-xl font-bold mb-4">
              Content Performance
              {tagCombinations.length > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Filtered by selected tag combinations)
                </span>
              )}
            </h2>
            <ContentTable data={filteredContentData} />
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;