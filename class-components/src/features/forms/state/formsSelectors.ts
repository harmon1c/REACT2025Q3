import { createSelector } from '@reduxjs/toolkit';
import type { RootStateShape } from '@/store/types';
import type {
  FormSubmissionSafe,
  FormsSubmissionsState,
} from './formsSubmissionsSlice';

const base = (s: RootStateShape): FormsSubmissionsState => s.formsSubmissions;
export const selectUncontrolledSubmissions = (
  s: RootStateShape
): FormSubmissionSafe[] => base(s).uncontrolled;
export const selectRHFSubmissions = (s: RootStateShape): FormSubmissionSafe[] =>
  base(s).rhf;

export const selectUncontrolledCount = createSelector(
  [selectUncontrolledSubmissions],
  (list) => list.length
);
export const selectRHFCount = createSelector(
  [selectRHFSubmissions],
  (list) => list.length
);
export const selectTotalSubmissionsCount = createSelector(
  [selectUncontrolledCount, selectRHFCount],
  (a, b) => a + b
);
export const selectAllSubmissions = createSelector(
  [selectUncontrolledSubmissions, selectRHFSubmissions],
  (u, r): FormSubmissionSafe[] =>
    [...u, ...r].sort((a, b) => b.createdAt - a.createdAt)
);
