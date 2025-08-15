'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';

function formatDate(ts: number): string {
  try {
    return new Date(ts).toLocaleTimeString();
  } catch {
    return '';
  }
}

export function SubmissionsTiles(): React.JSX.Element {
  const uncontrolled = useAppSelector(
    (state) => state.formsSubmissions.uncontrolled
  );
  const rhf = useAppSelector((state) => state.formsSubmissions.rhf);
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newestIds: string[] = [];
    if (uncontrolled[0]) {
      newestIds.push(uncontrolled[0].id);
    }
    if (rhf[0]) {
      newestIds.push(rhf[0].id);
    }
    if (newestIds.length === 0) {
      return;
    }
    setFlashIds((prev) => {
      const next = new Set(prev);
      newestIds.forEach((id) => next.add(id));
      return next;
    });
    const handle = window.setTimeout(() => {
      setFlashIds((prev) => {
        const next = new Set(prev);
        newestIds.forEach((id) => next.delete(id));
        return next;
      });
    }, 3000);
    return (): void => {
      window.clearTimeout(handle);
    };
  }, [uncontrolled, rhf]);
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Uncontrolled Submissions</h3>
        <ul className="space-y-2">
          {uncontrolled.slice(0, 5).map((s) => {
            const flashing = flashIds.has(s.id);
            return (
              <li
                key={s.id}
                className={
                  'p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-xs flex flex-col gap-1 motion-safe:transition-colors duration-700 ' +
                  (flashing
                    ? 'bg-green-100 dark:bg-green-900/40'
                    : 'bg-white/80 dark:bg-gray-800/60')
                }
              >
                <span className="font-medium flex items-center gap-2">
                  {s.avatarBase64 && (
                    <Image
                      src={s.avatarBase64}
                      alt={s.name + ' avatar'}
                      width={24}
                      height={24}
                      unoptimized
                      className="w-6 h-6 rounded object-cover ring-1 ring-gray-300 dark:ring-gray-600"
                      sizes="24px"
                    />
                  )}
                  {s.name}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {s.email} • {s.gender} • {s.age ?? '-'} • {s.country || '-'}
                </span>
                <span className="text-[10px] text-gray-400">
                  {formatDate(s.createdAt)}
                </span>
              </li>
            );
          })}
          {uncontrolled.length === 0 && (
            <li className="text-xs text-gray-500">No submissions yet.</li>
          )}
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">RHF Submissions</h3>
        <ul className="space-y-2">
          {rhf.slice(0, 5).map((s) => {
            const flashing = flashIds.has(s.id);
            return (
              <li
                key={s.id}
                className={
                  'p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-xs flex flex-col gap-1 motion-safe:transition-colors duration-700 ' +
                  (flashing
                    ? 'bg-purple-100 dark:bg-purple-900/40'
                    : 'bg-white/80 dark:bg-gray-800/60')
                }
              >
                <span className="font-medium flex items-center gap-2">
                  {s.avatarBase64 && (
                    <Image
                      src={s.avatarBase64}
                      alt={s.name + ' avatar'}
                      width={24}
                      height={24}
                      unoptimized
                      className="w-6 h-6 rounded object-cover ring-1 ring-gray-300 dark:ring-gray-600"
                      sizes="24px"
                    />
                  )}
                  {s.name}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {s.email} • {s.gender} • {s.age ?? '-'} • {s.country || '-'}
                </span>
                <span className="text-[10px] text-gray-400">
                  {formatDate(s.createdAt)}
                </span>
              </li>
            );
          })}
          {rhf.length === 0 && (
            <li className="text-xs text-gray-500">No submissions yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
