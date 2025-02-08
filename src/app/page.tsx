'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { TrendChart } from '@/components/TrendChart';
import { ContentTable } from '@/components/ContentTable';
import { ScatterPlot } from '@/components/ScatterPlot';
import { Filters } from '@/components/Filters';
import { LayoutGrid } from 'lucide-react';
import { EngagementWatchTimeScatter } from '@/components/EngagementWatchTimeScatter';
import { DotPlot } from '@/components/DotPlot';
import { CombinedMetricsChart } from '@/components/CombinedMetricsChart';
import { format, parse } from 'date-fns';
import type { ContentData, OverviewData } from '@/types';

// ... resto do código do App.tsx permanece igual ...

export default function Home() {
  // ... todo o conteúdo da função App ...
} 