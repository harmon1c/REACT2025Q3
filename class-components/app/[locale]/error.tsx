'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorPageProps): React.JSX.Element {
  const t = useTranslations('errors');

  React.useEffect(() => {
    console.error('🚨 Next.js Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-red-200 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
        <div className="text-red-500 mb-6">
          <svg
            className="w-20 h-20 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t('somethingWrong')}
        </h2>

        <p className="text-gray-600 mb-6">{t('errorMessage')}</p>

        {error.digest && (
          <p className="text-xs text-gray-400 mb-4">Error ID: {error.digest}</p>
        )}

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out transform hover:scale-105"
          >
            {t('tryAgain')}
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out"
          >
            {t('goHome')}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">{t('supportMessage')}</p>
        </div>
      </div>
    </div>
  );
}
