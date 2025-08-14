import { z } from 'zod';
import { evaluatePasswordStrength } from '../utils/passwordStrength';

export const UserRegistrationSchema = z
  .object({
    name: z
      .string()
      .min(1, 'forms.errors.name_required')
      .regex(/^[A-ZА-Я].*/, 'forms.errors.name_capital'),
    age: z
      .string()
      .min(1, 'forms.errors.age_required')
      .refine((v) => {
        if (v.trim() === '') {
          return false;
        }
        const n = Number(v);
        return Number.isInteger(n) && n >= 0;
      }, 'forms.errors.age_number'),
    email: z
      .string()
      .min(1, 'forms.errors.email_required')
      .email('forms.errors.email_invalid'),
    gender: z.string().min(1, 'forms.errors.gender_required'),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'forms.errors.terms_required' }),
    }),
    password: z
      .string()
      .min(8, 'forms.errors.password_weak')
      .refine(
        (v) =>
          /[a-z]/.test(v) &&
          /[A-Z]/.test(v) &&
          /\d/.test(v) &&
          /[^A-Za-z0-9]/.test(v),
        'forms.errors.password_weak'
      ),
    confirmPassword: z
      .string()
      .min(1, 'forms.errors.confirm_password_required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'forms.errors.passwords_mismatch',
    path: ['confirmPassword'],
  })
  .refine((data) => evaluatePasswordStrength(data.password).score >= 2, {
    message: 'forms.errors.password_weak',
    path: ['password'],
  });

export type UserRegistrationInput = z.infer<typeof UserRegistrationSchema>;
