export interface BaseUserFormValues {
  name: string;
  age: number | '';
  email: string;
  gender: string;
  termsAccepted: boolean;
}

export type SubmissionSource = 'uncontrolled' | 'rhf';
