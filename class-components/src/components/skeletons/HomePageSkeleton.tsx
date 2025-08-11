import React from 'react';

function Block({ className = '' }: { className?: string }): React.JSX.Element {
  return (
    <div
      className={`animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 ${className}`}
    />
  );
}

export function HomePageSkeleton(): React.JSX.Element {
  return (
    <div className="w-full">
      <div className="mb-6">
        <Block className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm"
          >
            <Block className="h-24 w-full mb-4" />
            <Block className="h-4 w-3/4 mb-2" />
            <Block className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePageSkeleton;
