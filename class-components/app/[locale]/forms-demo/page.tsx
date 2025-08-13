import React from 'react';
import {
  UncontrolledFormPlaceholder,
  RHFFormPlaceholder,
} from '@/features/forms';

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
      <section className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-md shadow-sm bg-white/70 dark:bg-blue-950/40 backdrop-blur p-4">
          <h2 className="font-medium mb-2">Uncontrolled Form</h2>
          <UncontrolledFormPlaceholder />
        </div>
        <div className="border rounded-md shadow-sm bg-white/70 dark:bg-blue-950/40 backdrop-blur p-4">
          <h2 className="font-medium mb-2">React Hook Form</h2>
          <RHFFormPlaceholder />
        </div>
      </section>
      <section className="text-xs text-gray-500 dark:text-gray-400">
        <p>
          Next phases will add: portal modal, validation schemas, password
          strength, image upload, autocomplete, accessibility, and final tests
          suite.
        </p>
      </section>
    </div>
  );
}
