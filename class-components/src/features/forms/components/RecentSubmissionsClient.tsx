'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectAllSubmissions } from '@/features/forms/state/formsSelectors';
import { SubmissionsTiles } from './SubmissionsTiles';
import { SubmissionsList } from './SubmissionsList';

const selectCombined = selectAllSubmissions;

export function RecentSubmissionsClient(): React.JSX.Element | null {
  const submissions = useAppSelector(selectCombined);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  const [flashId, setFlashId] = useState<string | null>(null);
  const initialisedRef = useRef(false);
  const prevFirstId = useRef<string | null>(null);

  useEffect(() => {
    const firstId = submissions.length > 0 ? submissions[0].id : null;
    if (!initialisedRef.current) {
      initialisedRef.current = true;
      prevFirstId.current = firstId;
      return;
    }
    if (firstId && firstId !== prevFirstId.current) {
      prevFirstId.current = firstId;
      setFlashId(firstId);
      const timeout = setTimeout(() => setFlashId(null), 2500);
      return (): void => clearTimeout(timeout);
    }
    return undefined;
  }, [submissions]);

  if (!hydrated) {
    return null;
  }
  return (
    <div className="w-full">
      <SubmissionsTiles />
      <SubmissionsList flashSubmissionId={flashId} limit={2} />
    </div>
  );
}

export default RecentSubmissionsClient;
