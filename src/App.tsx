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

// Adicionar função auxiliar para converter data
function convertDate(dateStr: string): Date {
  try {
    const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
    // Garantir que o ano seja 2024 para as datas do CSV
    const fullYear = year < 100 ? 2000 + year : year;
    return new Date(fullYear, month - 1, day);
  } catch (error) {
    console.error('Erro ao converter data:', dateStr, error);
    return new Date(); // Data padrão em caso de erro
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
    start: '2024-09-01',
    end: '2024-09-30',
  });

  const [viewsRange, setViewsRange] = useState({
    min: 0,
    max: 1500000,
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
    try {
      if (!item.postDay) {
        console.warn('Item sem data:', item);
        return false;
      }

      const itemDate = convertDate(item.postDay);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      // Adicionar logs para debug
      console.log('Filtragem:', {
        item: item.videoTitle,
        date: itemDate.toISOString(),
        views: item.totalViews,
        incluído: 
          itemDate >= startDate && 
          itemDate <= endDate && 
          item.totalViews >= viewsRange.min && 
          item.totalViews <= viewsRange.max
      });

      return (
        itemDate >= startDate && 
        itemDate <= endDate && 
        item.totalViews >= viewsRange.min && 
        item.totalViews <= viewsRange.max
      );
    } catch (error) {
      console.error('Erro ao filtrar item:', item, error);
      return false;
    }
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
    d3.csv('/src/components/data/Content.csv')
      .then((rawData) => {
        console.log('Dados brutos do CSV:', rawData.length);
        
        const processedData = rawData.map(row => ({
          postDay: row['Post day'] || '',
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
        }));

        console.log('Dados processados:', processedData.length);
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
            <ContentTable data={filteredContentData} /> {/* Use os dados filtrados */}
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
