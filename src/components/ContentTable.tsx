import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ContentData } from '../types';
import { ArrowUpDown } from 'lucide-react';

interface ContentTableProps {
  data: ContentData[];
}

const columnHelper = createColumnHelper<ContentData>();

const columns = [
  columnHelper.accessor('videoTitle', {
    header: 'Video Title',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('totalViews', {
    header: 'Total Views',
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor('totalLikes', {
    header: 'Total Likes',
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor('totalComments', {
    header: 'Total Comments',
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor('totalShares', {
    header: 'Total Shares',
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor('totalSaves', {
    header: 'Total Saves',
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor('avgWatchTime', {
    header: 'Avg Watch Time',
    cell: (info) => `${info.getValue().toFixed(2)}s`,
  }),
  columnHelper.accessor('totalVideoTime', {
    header: 'Total Video Time',
    cell: (info) => `${info.getValue()}s`,
  }),
  columnHelper.accessor('fullWatchPercentage', {
    header: 'Full Watch %',
    cell: (info) => {
      const value = info.getValue();
      let numericValue = 0;
  
      if (typeof value === 'string') {
        numericValue = parseFloat(value.replace('%', ''));
      } else if (typeof value === 'number') {
        numericValue = value;
      }
  
      return !isNaN(numericValue) ? `${numericValue.toFixed(2)}%` : '0%';
    },
  }),
  columnHelper.accessor('newFollowers', {
    header: 'New Followers',
    cell: (info) => info.getValue().toLocaleString(),
  }),
];

export const ContentTable: React.FC<ContentTableProps> = ({ data }) => {
  console.log('Dados recebidos:', data);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}