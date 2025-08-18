'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { UncontrolledRegistrationForm } from '../uncontrolled/UncontrolledRegistrationForm';
import { RHFRegistrationForm } from '../rhf/RHFRegistrationForm';
import { Modal } from './Modal';
import { SubmissionsTiles } from './SubmissionsTiles';
import { SubmissionsList } from './SubmissionsList';

export function FormsDemoClient(): React.JSX.Element {
  const [open, setOpen] = useState<null | 'uncontrolled' | 'rhf'>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null); // for counters
  const [flashSubmissionId, setFlashSubmissionId] = useState<string | null>(
    null
  );
  const t = useTranslations();

  useEffect(() => {
    if (!toast) {
      return;
    }
    const id = setTimeout(() => setToast(null), 3500);
    return (): void => clearTimeout(id);
  }, [toast]);
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
        <UncontrolledRegistrationForm
          onSuccess={(newId) => {
            setOpen(null);
            setToast(t('forms.status.submitted_temp'));
            setFlashId('uncontrolled');
            setFlashSubmissionId(newId || null);
            setTimeout(() => setFlashId(null), 2000);
          }}
        />
      </Modal>
      <Modal
        open={open === 'rhf'}
        onClose={() => setOpen(null)}
        title="RHF Form"
      >
        <RHFRegistrationForm
          onSuccess={(newId) => {
            setOpen(null);
            setToast(t('forms.status.submitted_temp'));
            setFlashId('rhf');
            setFlashSubmissionId(newId || null);
            setTimeout(() => setFlashId(null), 2000);
          }}
        />
      </Modal>
      <div
        className={
          (flashId === 'uncontrolled'
            ? 'ring-2 ring-green-400/70 rounded-md transition shadow '
            : 'transition ') + 'inline-block'
        }
      >
        <SubmissionsTiles />
      </div>
      <SubmissionsList flashSubmissionId={flashSubmissionId} />
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg bg-gray-900/90 text-white text-sm shadow-lg border border-gray-700 animate-fade-in"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
