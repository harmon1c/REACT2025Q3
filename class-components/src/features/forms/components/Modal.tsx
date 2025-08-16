'use client';
import React, { useCallback, useEffect, useRef } from 'react';
import { RootPortal } from './RootPortal';
import { trapTabKey, getFocusable } from './focusTrap';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  initialFocusRef,
}: ModalProps): React.JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const prevFocusedRef = useRef<HTMLElement | null>(null);

  const handleKey = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'Tab' && dialogRef.current) {
        trapTabKey(e, dialogRef.current);
      }
    },
    [onClose]
  );

  const handleOutside = useCallback(
    (e: MouseEvent): void => {
      if (
        dialogRef.current &&
        e.target instanceof Node &&
        !dialogRef.current.contains(e.target)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    const ae = document.activeElement;
    prevFocusedRef.current = ae instanceof HTMLElement ? ae : null;
    const body = document.documentElement;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey, true);
    document.addEventListener('mousedown', handleOutside, true);
    return (): void => {
      document.removeEventListener('keydown', handleKey, true);
      document.removeEventListener('mousedown', handleOutside, true);
      body.style.overflow = prevOverflow;
      if (prevFocusedRef.current) {
        prevFocusedRef.current.focus();
      }
    };
  }, [open, handleKey, handleOutside]);

  useEffect(() => {
    if (open && dialogRef.current) {
      const toFocus =
        initialFocusRef?.current || getFocusable(dialogRef.current)[0];
      toFocus?.focus();
    }
  }, [open, initialFocusRef]);

  if (!open) {
    return null;
  }

  return (
    <RootPortal>
      <div
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div
          ref={dialogRef}
          className="relative w-full max-w-lg rounded-lg border border-white/10 bg-white dark:bg-blue-950 shadow-xl focus:outline-none ring-1 ring-black/5 dark:ring-white/10 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <h2 id="modal-title" className="text-lg font-semibold">
              {title}
            </h2>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              ✕
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-4 custom-scrollbar">
            {/* Live region for form status / validation summary (populated in later phases). */}
            <div
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
              id="modal-status-region"
            />
            {children}
          </div>
        </div>
      </div>
    </RootPortal>
  );
}
