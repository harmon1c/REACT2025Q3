'use client';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/store/hooks';
import { addRHFSubmission } from '../state/formsSubmissionsSlice';
import {
  UserRegistrationSchema,
  type UserRegistrationInput,
} from '../validation/userRegistrationSchema';
import { StrengthMeter } from '../components/StrengthMeter';
import { ImageInput } from '../components/ImageInput';
import { CountriesAutocomplete } from '../components/CountriesAutocomplete';

interface RHFRegistrationFormProps {
  onSuccess?: (id: string) => void;
  open?: boolean;
}

export function RHFRegistrationForm({
  onSuccess,
  open = true,
}: RHFRegistrationFormProps): React.JSX.Element {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState, reset, watch, setValue } =
    useForm<UserRegistrationInput>({
      resolver: zodResolver(UserRegistrationSchema),
      mode: 'onChange',
      criteriaMode: 'all',
      defaultValues: {
        name: '',
        age: '',
        email: '',
        gender: '',
        country: '',
        terms: false,
        password: '',
        confirmPassword: '',
      },
    });
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  const internalSubmit = handleSubmit(
    (data) => {
      const action = addRHFSubmission({
        name: data.name,
        age: data.age ? Number(data.age) : null,
        email: data.email,
        gender: data.gender,
        country: data.country || undefined,
        avatarBase64: avatarBase64 || undefined,
      });
      dispatch(action);
      if (onSuccess) {
        onSuccess(action.payload.id);
      }
    },
    () => {
      /* validation errors ignored silently in prod */
    }
  );
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    void internalSubmit(e);
  };

  const { errors, isSubmitting, isValid } = formState;
  const passwordValue = watch('password');
  const genderValue = watch('gender');
  const countryValue = watch('country');

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`relative p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/70 backdrop-blur-sm shadow-md space-y-6 text-gray-800 dark:text-gray-100 transition-all duration-300 ease-out origin-top ${open ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-[0.98] pointer-events-none'}`}
      aria-describedby="modal-status-region"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-700 dark:via-fuchsia-700 dark:to-pink-700"
        aria-hidden="true"
      />
      <header className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {t('forms.titles.rhf')}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('forms.descriptions.rhf_intro')}
        </p>
      </header>
      <div className="flex flex-col gap-1">
        <label htmlFor="rhf_name" className="font-medium text-sm">
          {t('forms.labels.name')}
        </label>
        <input
          id="rhf_name"
          type="text"
          placeholder={t('forms.placeholders.name')}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 motion-safe:transition-colors"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'rhf-err-name' : undefined}
          {...register('name', {
            required: 'forms.errors.name_required',
            validate: (v: string) =>
              /^[A-ZА-Я]/.test(v) ? true : 'forms.errors.name_capital',
          })}
        />
        <p id="rhf-err-name" className="text-xs text-red-600 min-h-4">
          {typeof errors.name?.message === 'string'
            ? t(errors.name.message)
            : ''}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="rhf_age" className="font-medium text-sm">
          {t('forms.labels.age')}
        </label>
        <input
          id="rhf_age"
          type="number"
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 motion-safe:transition-colors"
          aria-invalid={!!errors.age}
          aria-describedby={errors.age ? 'rhf-err-age' : undefined}
          {...register('age', {
            required: 'forms.errors.age_required',
            validate: (v: string) => {
              if (v.trim() === '') {
                return 'forms.errors.age_required';
              }
              const n = Number(v);
              if (!Number.isInteger(n) || n < 0) {
                return 'forms.errors.age_number';
              }
              return true;
            },
          })}
        />
        <p id="rhf-err-age" className="text-xs text-red-600 min-h-4">
          {typeof errors.age?.message === 'string' ? t(errors.age.message) : ''}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="rhf_email" className="font-medium text-sm">
          {t('forms.labels.email')}
        </label>
        <input
          id="rhf_email"
          type="email"
          placeholder={t('forms.placeholders.email')}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 motion-safe:transition-colors"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'rhf-err-email' : undefined}
          {...register('email', {
            required: 'forms.errors.email_required',
            validate: (v: string) =>
              /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v)
                ? true
                : 'forms.errors.email_invalid',
          })}
        />
        <p id="rhf-err-email" className="text-xs text-red-600 min-h-4">
          {typeof errors.email?.message === 'string'
            ? t(errors.email.message)
            : ''}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="rhf_password" className="font-medium text-sm">
          {t('forms.labels.password')}
        </label>
        <input
          id="rhf_password"
          type="password"
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 motion-safe:transition-colors"
          aria-invalid={!!errors.password}
          aria-describedby={
            errors.password ? 'rhf-err-password' : 'rhf-strength'
          }
          {...register('password')}
        />
        <p id="rhf-err-password" className="text-xs text-red-600 min-h-4">
          {typeof errors.password?.message === 'string'
            ? t(errors.password.message)
            : ''}
        </p>
        <StrengthMeter password={passwordValue || ''} id="rhf-strength" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="rhf_confirm_password" className="font-medium text-sm">
          {t('forms.labels.confirm_password')}
        </label>
        <input
          id="rhf_confirm_password"
          type="password"
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 motion-safe:transition-colors"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={
            errors.confirmPassword ? 'rhf-err-confirm' : undefined
          }
          {...register('confirmPassword')}
        />
        <p id="rhf-err-confirm" className="text-xs text-red-600 min-h-4">
          {typeof errors.confirmPassword?.message === 'string'
            ? t(errors.confirmPassword.message)
            : ''}
        </p>
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="font-medium text-sm">
          {t('forms.labels.gender')}
        </legend>
        <div
          className="flex flex-wrap gap-4 text-sm"
          aria-describedby={errors.gender ? 'rhf-err-gender' : undefined}
        >
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="male"
              aria-checked={genderValue === 'male'}
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
              {...register('gender', {
                required: 'forms.errors.gender_required',
              })}
            />
            {t('forms.labels.gender_male')}
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="female"
              aria-checked={genderValue === 'female'}
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
              {...register('gender', {
                required: 'forms.errors.gender_required',
              })}
            />
            {t('forms.labels.gender_female')}
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="other"
              aria-checked={genderValue === 'other'}
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
              {...register('gender', {
                required: 'forms.errors.gender_required',
              })}
            />
            {t('forms.labels.gender_other')}
          </label>
        </div>
        <p id="rhf-err-gender" className="text-xs text-red-600 min-h-4">
          {typeof errors.gender?.message === 'string'
            ? t(errors.gender.message)
            : ''}
        </p>
      </fieldset>
      <div className="flex flex-col gap-1">
        <CountriesAutocomplete
          id="rhf_country"
          name="country"
          value={countryValue || ''}
          onChange={(v) => {
            setValue('country', v, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
          placeholder={t('forms.placeholders.country')}
          error={
            typeof errors.country?.message === 'string'
              ? t(errors.country.message)
              : undefined
          }
        />
      </div>
      <div className="flex items-start gap-2">
        <input
          id="rhf_terms"
          type="checkbox"
          aria-describedby={`${errors.terms ? 'rhf-err-terms ' : ''}rhf-terms-note`}
          aria-invalid={!!errors.terms}
          {...register('terms', {
            validate: (v: boolean) =>
              v ? true : 'forms.errors.terms_required',
          })}
          className="mt-0.5 h-4 w-4 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/60 text-purple-600 focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
        />
        <label htmlFor="rhf_terms" className="text-sm leading-snug">
          {t('forms.labels.terms')}
        </label>
      </div>
      <p id="rhf-err-terms" className="text-xs text-red-600 min-h-4">
        {typeof errors.terms?.message === 'string'
          ? t(errors.terms.message)
          : ''}
      </p>
      <p
        id="rhf-terms-note"
        className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug"
      >
        {t('forms.descriptions.terms_notice')}
      </p>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="rounded-md bg-gradient-to-r from-purple-600 to-fuchsia-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2 text-sm font-medium shadow hover:from-purple-500 hover:to-fuchsia-500 focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900 motion-safe:transition-colors"
        >
          {t('forms.labels.submit')}
        </button>
        <button
          type="reset"
          onClick={() => {
            reset();
            setAvatarBase64(null);
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
    </form>
  );
}
