import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface FormSubmissionSafe {
  id: string;
  formType: 'uncontrolled' | 'rhf';
  name: string;
  age: number | null;
  email: string;
  gender: string;
  avatarBase64?: string;
  createdAt: number;
}

export interface FormsSubmissionsState {
  uncontrolled: FormSubmissionSafe[];
  rhf: FormSubmissionSafe[];
}

const initialState: FormsSubmissionsState = {
  uncontrolled: [],
  rhf: [],
};

export const formsSubmissionsSlice = createSlice({
  name: 'formsSubmissions',
  initialState,
  reducers: {
    addUncontrolledSubmission: (
      state,
      action: PayloadAction<
        Omit<FormSubmissionSafe, 'id' | 'createdAt' | 'formType'>
      >
    ) => {
      state.uncontrolled.unshift({
        id: nanoid(),
        createdAt: Date.now(),
        formType: 'uncontrolled',
        ...action.payload,
      });
    },
    addRHFSubmission: (
      state,
      action: PayloadAction<
        Omit<FormSubmissionSafe, 'id' | 'createdAt' | 'formType'>
      >
    ) => {
      state.rhf.unshift({
        id: nanoid(),
        createdAt: Date.now(),
        formType: 'rhf',
        ...action.payload,
      });
    },
  },
});

export const { addUncontrolledSubmission, addRHFSubmission } =
  formsSubmissionsSlice.actions;

export function selectUncontrolledSubmissions<
  T extends { formsSubmissions?: FormsSubmissionsState },
>(state: T): FormSubmissionSafe[] {
  return state.formsSubmissions?.uncontrolled ?? [];
}
export function selectRHFSubmissions<
  T extends { formsSubmissions?: FormsSubmissionsState },
>(state: T): FormSubmissionSafe[] {
  return state.formsSubmissions?.rhf ?? [];
}

export default formsSubmissionsSlice.reducer;
