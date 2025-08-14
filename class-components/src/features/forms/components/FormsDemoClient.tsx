'use client';
import React, { useState } from 'react';
import { UncontrolledRegistrationForm } from '../uncontrolled/UncontrolledRegistrationForm';
import { RHFRegistrationForm } from '../rhf/RHFRegistrationForm';
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
        Phase 4: Both forms now have core fields. RHF version uses basic inline
        rules; full Zod + extra fields arrive in Phase 5.
      </p>
      <Modal
        open={open === 'uncontrolled'}
        onClose={() => setOpen(null)}
        title="Uncontrolled Form"
      >
        <UncontrolledRegistrationForm />
      </Modal>
      <Modal
        open={open === 'rhf'}
        onClose={() => setOpen(null)}
        title="RHF Form"
      >
        <RHFRegistrationForm />
      </Modal>
    </div>
  );
}
