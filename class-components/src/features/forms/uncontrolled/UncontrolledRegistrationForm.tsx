'use client';
import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { UserRegistrationSchema } from '../validation/userRegistrationSchema';
import { addUncontrolledSubmission } from '../state/formsSubmissionsSlice';
import { StrengthMeter } from '../components/StrengthMeter';
import { ImageInput } from '../components/ImageInput';
import { CountriesAutocomplete } from '../components/CountriesAutocomplete';
import { evaluatePasswordStrength } from '../utils/passwordStrength';

interface FieldErrors {
  name?: string;
  age?: string;
  email?: string;
  gender?: string;
  country?: string;
  terms?: string;
  password?: string;
  confirmPassword?: string;
}

interface SubmissionPreview {
  name: string;
  age: number | null;
  email: string;
  gender: string;
  country: string;
  termsAccepted: boolean;
  password?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function UncontrolledRegistrationForm(): React.JSX.Element {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState<SubmissionPreview | null>(null);
  const [status, setStatus] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const dispatch = useAppDispatch();
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  const validate = useCallback((fd: FormData): FieldErrors => {
    const next: FieldErrors = {};
    const rawName = fd.get('name');
    const rawAge = fd.get('age');
    const rawEmail = fd.get('email');
    const rawGender = fd.get('gender');
    const terms = fd.get('terms');
    const rawCountry = fd.get('country');
    const rawPassword = fd.get('password');
    const rawConfirm = fd.get('confirmPassword');

    const name = typeof rawName === 'string' ? rawName.trim() : '';
    const ageRaw = typeof rawAge === 'string' ? rawAge.trim() : '';
    const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';
    const gender = typeof rawGender === 'string' ? rawGender : '';
    const country = typeof rawCountry === 'string' ? rawCountry.trim() : '';
    if (!country) {
      next.country = 'forms.errors.country_required';
    }

    if (!name) {
      next.name = 'forms.errors.name_required';
    } else if (!/^[A-ZА-Я]/.test(name)) {
      next.name = 'forms.errors.name_capital';
    }

    if (!ageRaw) {
      next.age = 'forms.errors.age_required';
    } else {
      const ageNum = Number(ageRaw);
      if (!Number.isInteger(ageNum) || ageNum < 0) {
        next.age = 'forms.errors.age_number';
      }
    }

    if (!email) {
      next.email = 'forms.errors.email_required';
    } else if (!emailRegex.test(email)) {
      next.email = 'forms.errors.email_invalid';
    }

    if (!gender) {
      next.gender = 'forms.errors.gender_required';
    }
    if (terms !== 'on') {
      next.terms = 'forms.errors.terms_required';
    }

    if (typeof rawPassword !== 'string' || rawPassword.trim() === '') {
      next.password = 'forms.errors.password_required';
    }
    if (typeof rawConfirm !== 'string' || rawConfirm.trim() === '') {
      next.confirmPassword = 'forms.errors.confirm_password_required';
    }
    return next;
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const manual = validate(fd);
      const assembled = {
        name: fd.get('name') || '',
        age: fd.get('age') || '',
        email: fd.get('email') || '',
        gender: fd.get('gender') || '',
        country: fd.get('country') || '',
        terms: fd.get('terms') === 'on',
        password: fd.get('password') || '',
        confirmPassword: fd.get('confirmPassword') || '',
      };
      const parsed = UserRegistrationSchema.safeParse(assembled);
      if (!parsed.success) {
        const zodErrors: FieldErrors = { ...manual };
        const isFieldKey = (k: unknown): k is keyof FieldErrors =>
          typeof k === 'string' &&
          [
            'name',
            'age',
            'email',
            'gender',
            'country',
            'terms',
            'password',
            'confirmPassword',
          ].includes(k);
        for (const issue of parsed.error.issues) {
          const key = issue.path[0];
          if (isFieldKey(key)) {
            zodErrors[key] = issue.message;
          }
        }
        setErrors(zodErrors);
        setStatus('');
        return;
      }
      setErrors({});
      const rawName = fd.get('name');
      const rawAge = fd.get('age');
      const rawEmail = fd.get('email');
      const rawGender = fd.get('gender');
      const preview: SubmissionPreview = {
        name: typeof rawName === 'string' ? rawName.trim() : '',
        age: typeof rawAge === 'string' ? Number(rawAge.trim()) : null,
        email: typeof rawEmail === 'string' ? rawEmail.trim() : '',
        gender: typeof rawGender === 'string' ? rawGender : '',
        country: ((): string => {
          const c = fd.get('country');
          return typeof c === 'string' ? c.trim() : '';
        })(),
        termsAccepted: fd.get('terms') === 'on',
        password:
          typeof assembled.password === 'string'
            ? assembled.password
            : undefined,
      };
      setSubmitted(preview);
      setStatus('forms.status.submitted_temp');
      dispatch(
        addUncontrolledSubmission({
          name: preview.name,
          age: preview.age,
          email: preview.email,
          gender: preview.gender,
          country: preview.country,
          avatarBase64: avatarBase64 || undefined,
        })
      );
      // eslint-disable-next-line no-console
      console.log('[Phase5] Uncontrolled submission preview', {
        ...preview,
        password: preview.password ? '***' : undefined,
      });
    },
    [validate, dispatch, avatarBase64]
  );

  const fieldError = (key: keyof FieldErrors): string | undefined =>
    errors[key];

  const passwordStrengthScore = useMemo(
    () => evaluatePasswordStrength(password).score,
    [password]
  );

  const hasBlockingErrors = useMemo(() => {
    if (Object.keys(errors).length > 0) {
      return true;
    }
    if (password && passwordStrengthScore < 2) {
      return true;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      return true;
    }
    return false;
  }, [errors, password, confirmPassword, passwordStrengthScore]);

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="relative p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/70 backdrop-blur-sm shadow-md space-y-6 text-gray-800 dark:text-gray-100"
      aria-describedby="modal-status-region"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-indigo-600 dark:to-purple-700"
        aria-hidden="true"
      />
      <header className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          forms.titles.uncontrolled
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          forms.descriptions.uncontrolled_intro
        </p>
      </header>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {status}
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="un_name"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          forms.labels.name
        </label>
        <input
          id="un_name"
          name="name"
          type="text"
          placeholder="forms.placeholders.name"
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          aria-invalid={!!fieldError('name')}
          aria-describedby={fieldError('name') ? 'err-name' : undefined}
        />
        <p id="err-name" className="text-xs text-red-500 mt-1 min-h-4">
          {fieldError('name')}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="un_password"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          forms.labels.password
        </label>
        <input
          id="un_password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          aria-invalid={!!fieldError('password')}
          aria-describedby={
            fieldError('password') ? 'err-password' : 'un-strength'
          }
        />
        <p id="err-password" className="text-xs text-red-500 mt-1 min-h-4">
          {fieldError('password')}
        </p>
        <StrengthMeter password={password} id="un-strength" />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="un_confirm_password"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          forms.labels.confirm_password
        </label>
        <input
          id="un_confirm_password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          aria-invalid={!!fieldError('confirmPassword')}
          aria-describedby={
            fieldError('confirmPassword') ? 'err-confirm-password' : undefined
          }
        />
        <p
          id="err-confirm-password"
          className="text-xs text-red-500 mt-1 min-h-4"
        >
          {fieldError('confirmPassword')}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="un_country"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          forms.labels.country
        </label>
        <CountriesAutocomplete
          value={''}
          onChange={() => {
            /* value read from form submit */
          }}
          id="un_country"
          name="country"
          placeholder="forms.placeholders.country"
          error={fieldError('country')}
        />
        <p id="err-country" className="text-xs text-red-500 mt-1 min-h-4">
          {fieldError('country')}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="un_email" className="font-medium text-sm">
          forms.labels.email
        </label>
        <input
          id="un_email"
          name="email"
          type="email"
          placeholder="forms.placeholders.email"
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          aria-invalid={!!fieldError('email')}
          aria-describedby={fieldError('email') ? 'err-email' : undefined}
        />
        {fieldError('email') && (
          <p id="err-email" className="text-xs text-red-500 mt-1 min-h-4">
            {fieldError('email')}
          </p>
        )}
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-gray-700 dark:text-gray-200">
          forms.labels.gender
        </legend>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-1">
            <input type="radio" name="gender" value="male" />
            forms.labels.gender_male
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="gender" value="female" />
            forms.labels.gender_female
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="gender" value="other" />
            forms.labels.gender_other
          </label>
        </div>
        {fieldError('gender') && (
          <p id="err-gender" className="text-xs text-red-500 mt-1 min-h-4">
            {fieldError('gender')}
          </p>
        )}
      </fieldset>
      <div className="flex items-start gap-2">
        <input
          id="un_terms"
          name="terms"
          type="checkbox"
          aria-invalid={!!fieldError('terms')}
          aria-describedby={fieldError('terms') ? 'err-terms' : undefined}
          className="mt-0.5 h-4 w-4 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/60 text-blue-600 focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
        />
        <label htmlFor="un_terms" className="text-sm leading-snug">
          forms.labels.terms
        </label>
      </div>
      {fieldError('terms') && (
        <p id="err-terms" className="text-xs text-red-500 mt-1 min-h-4">
          {fieldError('terms')}
        </p>
      )}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={hasBlockingErrors}
          className="rounded-md bg-gradient-to-r from-green-600 to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 text-sm font-medium shadow hover:from-green-500 hover:to-emerald-500 focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-colors"
        >
          forms.labels.submit
        </button>
        <button
          type="reset"
          onClick={() => {
            setErrors({});
            setStatus('');
            setSubmitted(null);
            setPassword('');
            setConfirmPassword('');
            setAvatarBase64(null);
          }}
          className="rounded-md bg-gray-200/80 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 px-5 py-2 text-sm font-medium shadow hover:bg-gray-300 dark:hover:bg-gray-700 focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-900 transition-colors"
        >
          forms.labels.reset
        </button>
      </div>
      <div>
        <ImageInput
          value={avatarBase64}
          onChange={setAvatarBase64}
          label="forms.labels.avatar"
        />
      </div>
      {submitted && (
        <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-gray-900/90 ring-1 ring-gray-700 text-[10px] text-green-300 p-3">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </form>
  );
}
