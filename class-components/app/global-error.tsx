'use client';

import React from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps): React.JSX.Element {
  React.useEffect(() => {
    console.error('🚨 Global Error caught:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-red-200 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Critical Application Error
            </h2>
            <p className="text-gray-600 mb-6">
              The application has encountered a critical error and needs to be
              restarted.
            </p>
            <button
              onClick={reset}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200"
            >
              Restart Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
