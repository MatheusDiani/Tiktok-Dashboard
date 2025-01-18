import { useState, useEffect } from 'react';
import * as d3 from 'd3'; // Biblioteca para carregar CSVs
import { TrendChart } from './components/TrendChart';
import { ContentTable } from './components/ContentTable';
import { ScatterPlot } from './components/ScatterPlot';
import { Filters } from './components/Filters';
import { LayoutGrid } from 'lucide-react';

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
};


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
    start: '2024-02-01',
    end: '2024-02-28',
  });

  const [viewsRange, setViewsRange] = useState({
    min: 0,
    max: 200000,
  });

  const toggleMetric = (metric: string) => {
    setVisibleMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  // Aplicar filtros nos dados
  const filteredOverviewData = overviewData.filter((item) => {
    const itemDate = new Date(item.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    return (
      itemDate >= startDate &&
      itemDate <= endDate &&
      item.videoViews >= viewsRange.min &&
      item.videoViews <= viewsRange.max
    );
  });

  const filteredContentData = contentData.filter((item) => {
    const itemDate = new Date(item.postDay);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    return (
      itemDate >= startDate &&
      itemDate <= endDate &&
      item.totalViews >= viewsRange.min &&
      item.totalViews <= viewsRange.max
    );
  });

  useEffect(() => {
    // Carregar e mapear Overview.csv
    d3.csv('/src/components/data/Overview.csv', (row) => ({
      date: row.Date || '',
      videoViews: Number(row['Video Views'] || 0),
      profileViews: Number(row['Profile Views'] || 0),
      likes: Number(row.Likes || 0),
      comments: Number(row.Comments || 0),
      shares: Number(row.Shares || 0),
    }))
      .then((data) => {
        setOverviewData(data as OverviewData[]);
        console.log('Overview Data:', data);
      })
      .catch((error) => console.error('Erro ao carregar Overview.csv:', error));

    // Carregar e mapear Content.csv
    d3.csv('/src/components/data/Content.csv', (row) => ({
      postDay: row['Post day'] || '',
      videoTitle: row['Video title'] || '',
      totalVideoTime: Number(row['Total video time'] || 0),
      totalViews: Number(row['Total views'] || 0),
      totalLikes: Number(row['Total likes'] || 0),
      totalComments: Number(row['Total comments'] || 0),
      totalShares: Number(row['Total shares'] || 0),
      totalSaves: Number(row['Total saves'] || 0),
      avgWatchTime: Number(row['Avg watch time'] || 0),
      fullWatchPercentage: parseFloat(
        (row['Full watch percentage'] || '0').replace('%', '')
      ),
      newFollowers: Number(row['New followers'] || 0),
    }))
      .then((data) => {
        setContentData(data as ContentData[]);
        console.log('Content Data:', data);
      })
      .catch((error) => console.error('Erro ao carregar Content.csv:', error));
  }, []);

  console.log('Filtered Content Data for ScatterPlot:', filteredContentData);

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
            data={filteredOverviewData} // Passar os dados filtrados
            visibleMetrics={visibleMetrics}
            onToggleMetric={toggleMetric}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <ScatterPlot data={filteredContentData} /> {/* Dados filtrados */}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">Content Performance</h2>
            <ContentTable data={contentData} /> {/* Teste sem filtragem */}
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
