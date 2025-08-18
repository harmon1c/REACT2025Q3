'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/store/hooks';
import {
  selectUncontrolledCount,
  selectRHFCount,
  selectTotalSubmissionsCount,
} from '../state/formsSelectors';

export function SubmissionsTiles(): React.JSX.Element {
  const t = useTranslations('ui');
  const uncontrolledCount = useAppSelector(selectUncontrolledCount);
  const rhfCount = useAppSelector(selectRHFCount);
  const totalCount = useAppSelector(selectTotalSubmissionsCount);

  return (
    <div
      className="flex flex-wrap items-center gap-2 text-[11px]"
      aria-label={t('form_stats.aria')}
    >
      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
        {t('form_stats.total', { count: totalCount })}
      </span>
      <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
        {t('form_stats.uncontrolled', { count: uncontrolledCount })}
      </span>
      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
        {t('form_stats.rhf', { count: rhfCount })}
      </span>
    </div>
  );
}
