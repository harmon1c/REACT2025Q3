'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearItems, type SelectedItem } from '../store/selectedItemsSlice';

function downloadCSV(items: SelectedItem[]): void {
  if (!items.length) {
    return;
  }
  const header: (keyof SelectedItem)[] = [
    'id',
    'name',
    'description',
    'detailsUrl',
  ];
  const csvRows = [
    header.join(','),
    ...items.map((row) =>
      header.map((field) => JSON.stringify(row[field] ?? '')).join(',')
    ),
  ];
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${items.length}_items.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export const SelectedFlyout: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);

  if (!selectedItems.length) {
    return null;
  }

  return (
    <div className="fixed z-50 bottom-6 right-8 flex flex-col items-end">
      <div className="bg-white dark:bg-gray-900/95 shadow-lg rounded-lg px-6 py-4 flex items-center gap-4 border border-blue-200 dark:border-gray-700 transition-colors duration-300">
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''}{' '}
          selected
        </span>
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-colors duration-200"
          onClick={() => dispatch(clearItems())}
        >
          Unselect all
        </button>
        <button
          className="px-3 py-1 rounded bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold hover:from-blue-600 hover:to-purple-700 dark:from-blue-700 dark:to-purple-800 dark:hover:from-blue-800 dark:hover:to-purple-900 transition-colors duration-200"
          onClick={() => downloadCSV(selectedItems)}
        >
          Download
        </button>
      </div>
    </div>
  );
};
