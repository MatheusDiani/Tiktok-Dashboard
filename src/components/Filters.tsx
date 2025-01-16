import React from 'react';
import { Calendar, Filter } from 'lucide-react';

interface FiltersProps {
  dateRange: { start: string; end: string };
  viewsRange: { min: number; max: number };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onViewsRangeChange: (range: { min: number; max: number }) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  dateRange,
  viewsRange,
  onDateRangeChange,
  onViewsRangeChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[200px]">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                onDateRangeChange({ ...dateRange, start: e.target.value })
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                onDateRangeChange({ ...dateRange, end: e.target.value })
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Filter className="h-4 w-4" />
            Views Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={viewsRange.min}
              onChange={(e) =>
                onViewsRangeChange({
                  ...viewsRange,
                  min: parseInt(e.target.value),
                })
              }
              placeholder="Min views"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              type="number"
              value={viewsRange.max}
              onChange={(e) =>
                onViewsRangeChange({
                  ...viewsRange,
                  max: parseInt(e.target.value),
                })
              }
              placeholder="Max views"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}