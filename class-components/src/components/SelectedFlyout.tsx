'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { buildCsvAction } from '@/actions/buildCsvAction';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearItems } from '../store/selectedItemsSlice';

export const SelectedFlyout: React.FC = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!selectedItems.length) {
    return null;
  }

  const handleDownload = async (): Promise<void> => {
    if (!selectedItems.length || loading) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const csv = await buildCsvAction(selectedItems.map((i) => i.id));
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pokemon_export_${selectedItems.length}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      const code = e instanceof Error ? e.message : 'UNKNOWN';
      if (code === 'INVALID_PAYLOAD') {
        setError(t('selection.export_invalid'));
      } else if (code === 'NO_DATA') {
        setError(t('selection.export_failed'));
      } else if (code === 'INTERNAL_ERROR') {
        setError(t('selection.export_internal'));
      } else {
        setError(t('selection.export_failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed z-50 bottom-6 right-8 flex flex-col items-end gap-2">
      <div className="bg-white dark:bg-gray-900/95 shadow-lg rounded-lg px-6 py-4 flex items-center gap-4 border border-blue-200 dark:border-gray-700 transition-colors duration-300">
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {t('selection.items_selected', { count: selectedItems.length })}
        </span>
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-colors duration-200 disabled:opacity-50"
          onClick={() => dispatch(clearItems())}
          disabled={loading}
        >
          {t('selection.unselect_all')}
        </button>
        <button
          className="px-3 py-1 rounded bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold hover:from-blue-600 hover:to-purple-700 dark:from-blue-700 dark:to-purple-800 dark:hover:from-blue-800 dark:hover:to-purple-900 transition-colors duration-200 disabled:opacity-50"
          onClick={() => {
            void handleDownload();
          }}
          disabled={loading}
        >
          {loading ? t('selection.exporting') : t('selection.download')}
        </button>
      </div>
      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
};
