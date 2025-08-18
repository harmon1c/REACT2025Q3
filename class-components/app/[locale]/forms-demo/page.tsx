import React from 'react';
import { FormsDemoClient } from '@/features/forms';

export default function FormsDemoPage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Forms Feature Scaffold</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Phase 1 placeholder content. Modals & full forms will be implemented
          in subsequent phases.
        </p>
      </header>
      <FormsDemoClient />
    </div>
  );
}
