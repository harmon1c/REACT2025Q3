import { z } from 'zod';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { countriesSet } from '../utils/countriesList';
import {
  NAME_CAPITAL_REGEX,
  PASSWORD_LOWER_REGEX,
  PASSWORD_UPPER_REGEX,
  PASSWORD_DIGIT_REGEX,
  PASSWORD_SPECIAL_REGEX,
  PASSWORD_MIN_LENGTH,
} from './validationConstants';

export const UserRegistrationSchema = z
  .object({
    name: z
      .string()
      .min(1, 'forms.errors.name_required')
      .regex(NAME_CAPITAL_REGEX, 'forms.errors.name_capital'),
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
    country: z
      .string()
      .min(1, 'forms.errors.country_required')
      .refine((v) => countriesSet.has(v), 'forms.errors.country_invalid'),
    terms: z.boolean().refine((v) => v === true, 'forms.errors.terms_required'),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, 'forms.errors.password_weak')
      .refine(
        (v) =>
          PASSWORD_LOWER_REGEX.test(v) &&
          PASSWORD_UPPER_REGEX.test(v) &&
          PASSWORD_DIGIT_REGEX.test(v) &&
          PASSWORD_SPECIAL_REGEX.test(v),
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
