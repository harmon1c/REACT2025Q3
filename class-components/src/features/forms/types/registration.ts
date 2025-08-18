// Shared types for registration forms (Phase 5 prep)
export interface BaseRegistrationFields {
  name: string;
  age: number; // sanitized integer
  email: string;
  gender: 'male' | 'female' | 'other';
  termsAccepted: boolean;
}

export interface PasswordFields {
  password: string;
  confirmPassword: string;
}

export type RegistrationWithPasswords = BaseRegistrationFields & PasswordFields;
