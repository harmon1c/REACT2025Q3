'use client';
import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppDispatch } from '@/store/hooks';
import { UserRegistrationSchema } from '../validation/userRegistrationSchema';
import { addUncontrolledSubmission } from '../state/formsSubmissionsSlice';
import { StrengthMeter } from '../components/StrengthMeter';
import { ImageInput } from '../components/ImageInput';
import { CountriesAutocomplete } from '../components/CountriesAutocomplete';

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

interface UncontrolledRegistrationFormProps {
  onSuccess?: (id: string) => void;
}

export function UncontrolledRegistrationForm({
  onSuccess,
}: UncontrolledRegistrationFormProps): React.JSX.Element {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState<SubmissionPreview | null>(null);
  const [status, setStatus] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const dispatch = useAppDispatch();
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  const buildAndValidate = (): FieldErrors => {
    if (!formRef.current) {
      return {};
    }
    const fd = new FormData(formRef.current);
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
    if (parsed.success) {
      return {};
    }
    const errs: FieldErrors = {};
    const isFieldKey = (k: unknown): k is keyof FieldErrors =>
      typeof k === 'string';
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (isFieldKey(key)) {
        errs[key] = issue.message;
      }
    }
    return errs;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setAttempted(true);
    const fieldErrors = buildAndValidate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      return;
    }
    if (!formRef.current) {
      return;
    }
    const fd = new FormData(formRef.current);
    const preview: SubmissionPreview = {
      name: String(fd.get('name') || '').trim(),
      age: ((): number | null => {
        const a = String(fd.get('age') || '').trim();
        return a ? Number(a) : null;
      })(),
      email: String(fd.get('email') || '').trim(),
      gender: String(fd.get('gender') || ''),
      country: String(fd.get('country') || '').trim(),
      termsAccepted: fd.get('terms') === 'on',
      password: String(fd.get('password') || ''),
    };
    setSubmitted(preview);
    setStatus('forms.status.submitted_temp');
    const action = addUncontrolledSubmission({
      name: preview.name,
      age: preview.age,
      email: preview.email,
      gender: preview.gender,
      country: preview.country,
      avatarBase64: avatarBase64 || undefined,
    });
    dispatch(action);
    if (onSuccess) {
      onSuccess(action.payload.id);
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLFormElement> = () => {
    if (!attempted) {
      return;
    }
    setErrors(buildAndValidate());
  };

  const fieldError = (key: keyof FieldErrors): string | undefined =>
    errors[key];
  const translateMaybe = (msg?: string): string | undefined => {
    if (!msg) {
      return msg;
    }
    if (msg.startsWith('forms.')) {
      return t(msg);
    }
    return msg;
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={handleChange}
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
          {t('forms.titles.uncontrolled')}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('forms.descriptions.uncontrolled_intro')}
        </p>
      </header>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {translateMaybe(status) || status}
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="un_name"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {t('forms.labels.name')}
        </label>
        <input
          id="un_name"
          name="name"
          type="text"
          placeholder={t('forms.placeholders.name')}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 motion-safe:transition-colors"
          aria-invalid={!!fieldError('name')}
          aria-describedby={fieldError('name') ? 'err-name' : undefined}
        />
        <p id="err-name" className="text-xs text-red-500 mt-1 min-h-4">
          {translateMaybe(fieldError('name'))}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="un_age"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {t('forms.labels.age')}
        </label>
        <input
          id="un_age"
          name="age"
          type="number"
          placeholder={t('forms.labels.age')}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 motion-safe:transition-colors"
          aria-invalid={!!fieldError('age')}
          aria-describedby={fieldError('age') ? 'err-age' : undefined}
        />
        <p id="err-age" className="text-xs text-red-500 mt-1 min-h-4">
          {translateMaybe(fieldError('age'))}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="un_password"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {t('forms.labels.password')}
        </label>
        <input
          id="un_password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 motion-safe:transition-colors"
          aria-invalid={!!fieldError('password')}
          aria-describedby={
            fieldError('password') ? 'err-password' : 'un-strength'
          }
        />
        <p id="err-password" className="text-xs text-red-500 mt-1 min-h-4">
          {translateMaybe(fieldError('password'))}
        </p>
        <StrengthMeter password={password} id="un-strength" />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="un_confirm_password"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {t('forms.labels.confirm_password')}
        </label>
        <input
          id="un_confirm_password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 motion-safe:transition-colors"
          aria-invalid={!!fieldError('confirmPassword')}
          aria-describedby={
            fieldError('confirmPassword') ? 'err-confirm-password' : undefined
          }
        />
        <p
          id="err-confirm-password"
          className="text-xs text-red-500 mt-1 min-h-4"
        >
          {translateMaybe(fieldError('confirmPassword'))}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <CountriesAutocomplete
          value={country}
          onChange={setCountry}
          id="un_country"
          name="country"
          placeholder={t('forms.placeholders.country')}
          error={translateMaybe(fieldError('country'))}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="un_email" className="font-medium text-sm">
          {t('forms.labels.email')}
        </label>
        <input
          id="un_email"
          name="email"
          type="email"
          placeholder={t('forms.placeholders.email')}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 motion-safe:transition-colors"
          aria-invalid={!!fieldError('email')}
          aria-describedby={fieldError('email') ? 'err-email' : undefined}
        />
        {fieldError('email') && (
          <p id="err-email" className="text-xs text-red-500 mt-1 min-h-4">
            {translateMaybe(fieldError('email'))}
          </p>
        )}
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {t('forms.labels.gender')}
        </legend>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="gender"
              value="male"
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            />
            {t('forms.labels.gender_male')}
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="gender"
              value="female"
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            />
            {t('forms.labels.gender_female')}
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="gender"
              value="other"
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            />
            {t('forms.labels.gender_other')}
          </label>
        </div>
        {fieldError('gender') && (
          <p id="err-gender" className="text-xs text-red-500 mt-1 min-h-4">
            {translateMaybe(fieldError('gender'))}
          </p>
        )}
      </fieldset>
      <div className="flex items-start gap-2">
        <input
          id="un_terms"
          name="terms"
          type="checkbox"
          aria-invalid={!!fieldError('terms')}
          aria-describedby={`${fieldError('terms') ? 'err-terms ' : ''}un-terms-note`}
          className="mt-0.5 h-4 w-4 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/60 text-blue-600 focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
        />
        <label htmlFor="un_terms" className="text-sm leading-snug">
          {t('forms.labels.terms')}
        </label>
      </div>
      {fieldError('terms') && (
        <p id="err-terms" className="text-xs text-red-500 mt-1 min-h-4">
          {translateMaybe(fieldError('terms'))}
        </p>
      )}
      <p
        id="un-terms-note"
        className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug"
      >
        {t('forms.descriptions.terms_notice')}
      </p>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={attempted && Object.keys(errors).length > 0}
          className="rounded-md bg-gradient-to-r from-green-600 to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 text-sm font-medium shadow hover:from-green-500 hover:to-emerald-500 focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 motion-safe:transition-colors"
        >
          {t('forms.labels.submit')}
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
            setAttempted(false);
            setCountry('');
          }}
          className="rounded-md bg-gray-200/80 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 px-5 py-2 text-sm font-medium shadow hover:bg-gray-300 dark:hover:bg-gray-700 focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-900 motion-safe:transition-colors"
        >
          {t('forms.labels.reset')}
        </button>
      </div>
      <div>
        <ImageInput
          value={avatarBase64}
          onChange={setAvatarBase64}
          label={t('forms.labels.avatar')}
        />
      </div>
      {submitted && (
        <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-gray-900/90 ring-1 ring-gray-700 text-[10px] text-green-300 p-3 custom-scrollbar">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </form>
  );
}
