'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';
import { selectAllSubmissions } from '@/features/forms/state/formsSelectors';

interface SubmissionsListProps {
  flashSubmissionId?: string | null;
  limit?: number;
}

export function SubmissionsList({
  flashSubmissionId,
  limit,
}: SubmissionsListProps): React.JSX.Element | null {
  const submissions = useAppSelector(selectAllSubmissions);
  const [activeFlash, setActiveFlash] = useState<string | null>(null);

  useEffect(() => {
    if (flashSubmissionId) {
      setActiveFlash(flashSubmissionId);
      const id = setTimeout(() => setActiveFlash(null), 2500);
      return (): void => clearTimeout(id);
    }
    return undefined;
  }, [flashSubmissionId]);

  if (submissions.length === 0) {
    return null;
  }
  const list =
    typeof limit === 'number' ? submissions.slice(0, limit) : submissions;

  return (
    <div
      className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2"
      aria-label="Submitted users list"
    >
      {list.map((s) => {
        const flash = activeFlash === s.id;
        return (
          <div
            key={s.id}
            className={
              'flex items-center gap-3 rounded-md border p-2 text-xs bg-white/70 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 shadow-sm motion-safe:transition ' +
              (flash
                ? 'ring-2 ring-green-400/70 animate-pulse'
                : 'hover:bg-white/90 dark:hover:bg-gray-800')
            }
          >
            {s.avatarBase64 ? (
              <Image
                src={s.avatarBase64}
                alt={s.name + ' avatar'}
                width={40}
                height={40}
                unoptimized
                className="rounded object-cover w-10 h-10 flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400 font-medium select-none">
                {s.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                {s.name}{' '}
                <span className="ml-1 text-[10px] px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  {s.formType}
                </span>
              </p>
              <p className="text-gray-500 dark:text-gray-400 truncate">
                {s.email}
              </p>
            </div>
            <time
              dateTime={new Date(s.createdAt).toISOString()}
              className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap"
            >
              {new Date(s.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </time>
          </div>
        );
      })}
    </div>
  );
}
