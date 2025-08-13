'use client';
import React, { useState } from 'react';
import { UncontrolledFormPlaceholder } from '../uncontrolled/UncontrolledFormPlaceholder';
import { RHFFormPlaceholder } from '../rhf/RHFFormPlaceholder';
import { Modal } from './Modal';

export function FormsDemoClient(): React.JSX.Element {
  const [open, setOpen] = useState<null | 'uncontrolled' | 'rhf'>(null);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => setOpen('uncontrolled')}
          className="rounded bg-blue-600 text-white px-4 py-2 text-sm font-medium shadow hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          Open Uncontrolled Form
        </button>
        <button
          type="button"
          onClick={() => setOpen('rhf')}
          className="rounded bg-purple-600 text-white px-4 py-2 text-sm font-medium shadow hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
        >
          Open RHF Form
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Phase 2 provides infrastructure only. Real fields and validation will
        arrive in later phases.
      </p>
      <Modal
        open={open === 'uncontrolled'}
        onClose={() => setOpen(null)}
        title="Uncontrolled Form (Scaffold)"
      >
        <UncontrolledFormPlaceholder />
      </Modal>
      <Modal
        open={open === 'rhf'}
        onClose={() => setOpen(null)}
        title="RHF Form (Scaffold)"
      >
        <RHFFormPlaceholder />
      </Modal>
    </div>
  );
}
