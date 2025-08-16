import { createSlice, nanoid } from '@reduxjs/toolkit';

export interface FormSubmissionSafe {
  id: string;
  formType: 'uncontrolled' | 'rhf';
  name: string;
  age: number | null;
  email: string;
  gender: string;
  country?: string;
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
    addUncontrolledSubmission: {
      reducer(
        state,
        {
          payload,
        }: {
          payload: FormSubmissionSafe;
          type: string;
        }
      ) {
        state.uncontrolled.unshift(payload);
      },
      prepare(data: Omit<FormSubmissionSafe, 'id' | 'createdAt' | 'formType'>) {
        return {
          payload: {
            id: nanoid(),
            createdAt: Date.now(),
            formType: 'uncontrolled' as const,
            ...data,
          },
        };
      },
    },
    addRHFSubmission: {
      reducer(
        state,
        { payload }: { payload: FormSubmissionSafe; type: string }
      ) {
        state.rhf.unshift(payload);
      },
      prepare(data: Omit<FormSubmissionSafe, 'id' | 'createdAt' | 'formType'>) {
        return {
          payload: {
            id: nanoid(),
            createdAt: Date.now(),
            formType: 'rhf' as const,
            ...data,
          },
        };
      },
    },
    setAllSubmissions: (
      _state,
      action: {
        payload: FormsSubmissionsState;
        type: string;
      }
    ) => ({
      uncontrolled: action.payload.uncontrolled ?? [],
      rhf: action.payload.rhf ?? [],
    }),
  },
});

export const {
  addUncontrolledSubmission,
  addRHFSubmission,
  setAllSubmissions,
} = formsSubmissionsSlice.actions;

export default formsSubmissionsSlice.reducer;
