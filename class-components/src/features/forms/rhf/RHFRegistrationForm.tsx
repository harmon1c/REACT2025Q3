'use client';
import React from 'react';
import { useForm } from 'react-hook-form';

interface RHFFormValues {
  name: string;
  age: string;
  email: string;
  gender: string;
  terms: boolean;
}

export function RHFRegistrationForm(): React.JSX.Element {
  const { register, handleSubmit, formState, reset, watch } =
    useForm<RHFFormValues>({
      defaultValues: { name: '', age: '', email: '', gender: '', terms: false },
      mode: 'onSubmit',
    });

  const internalSubmit = handleSubmit((data) => {
    // eslint-disable-next-line no-console
    console.log('[Phase4] RHF submission preview', data);
  });
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    void internalSubmit(e);
  };

  const { errors, isSubmitting } = formState;
  const genderValue = watch('gender');

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4"
      aria-describedby="modal-status-region"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="rhf_name" className="font-medium text-sm">
          forms.labels.name
        </label>
        <input
          id="rhf_name"
          type="text"
          placeholder="forms.placeholders.name"
          className="rounded border px-3 py-2 text-sm bg-white dark:bg-blue-900/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'rhf-err-name' : undefined}
          {...register('name', {
            required: 'forms.errors.name_required',
            validate: (v: string) =>
              /^[A-ZА-Я]/.test(v) ? true : 'forms.errors.name_capital',
          })}
        />
        <p id="rhf-err-name" className="text-xs text-red-600 min-h-4">
          {typeof errors.name?.message === 'string' ? errors.name.message : ''}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="rhf_age" className="font-medium text-sm">
          forms.labels.age
        </label>
        <input
          id="rhf_age"
          type="number"
          className="rounded border px-3 py-2 text-sm bg-white dark:bg-blue-900/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
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
          {typeof errors.age?.message === 'string' ? errors.age.message : ''}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="rhf_email" className="font-medium text-sm">
          forms.labels.email
        </label>
        <input
          id="rhf_email"
          type="email"
          placeholder="forms.placeholders.email"
          className="rounded border px-3 py-2 text-sm bg-white dark:bg-blue-900/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
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
            ? errors.email.message
            : ''}
        </p>
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="font-medium text-sm">forms.labels.gender</legend>
        <div
          className="flex flex-wrap gap-4 text-sm"
          aria-describedby={errors.gender ? 'rhf-err-gender' : undefined}
        >
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="male"
              aria-checked={genderValue === 'male'}
              {...register('gender', {
                required: 'forms.errors.gender_required',
              })}
            />
            forms.labels.gender_male
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="female"
              aria-checked={genderValue === 'female'}
              {...register('gender', {
                required: 'forms.errors.gender_required',
              })}
            />
            forms.labels.gender_female
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="other"
              aria-checked={genderValue === 'other'}
              {...register('gender', {
                required: 'forms.errors.gender_required',
              })}
            />
            forms.labels.gender_other
          </label>
        </div>
        <p id="rhf-err-gender" className="text-xs text-red-600 min-h-4">
          {typeof errors.gender?.message === 'string'
            ? errors.gender.message
            : ''}
        </p>
      </fieldset>
      <div className="flex items-start gap-2">
        <input
          id="rhf_terms"
          type="checkbox"
          aria-describedby={errors.terms ? 'rhf-err-terms' : undefined}
          aria-invalid={!!errors.terms}
          {...register('terms', {
            validate: (v: boolean) =>
              v ? true : 'forms.errors.terms_required',
          })}
          className="mt-0.5 h-4 w-4 rounded border text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        />
        <label htmlFor="rhf_terms" className="text-sm leading-snug">
          forms.labels.terms
        </label>
      </div>
      <p id="rhf-err-terms" className="text-xs text-red-600 min-h-4">
        {typeof errors.terms?.message === 'string' ? errors.terms.message : ''}
      </p>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 text-sm font-medium shadow hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
        >
          forms.labels.submit
        </button>
        <button
          type="reset"
          onClick={() => reset()}
          className="rounded bg-gray-200 dark:bg-blue-900/40 text-gray-900 dark:text-gray-100 px-4 py-2 text-sm font-medium shadow hover:bg-gray-300 dark:hover:bg-blue-800/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
        >
          forms.labels.reset
        </button>
      </div>
    </form>
  );
}
