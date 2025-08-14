'use client';
import React, { useCallback, useRef, useState } from 'react';

interface FieldErrors {
  name?: string;
  age?: string;
  email?: string;
  gender?: string;
  terms?: string;
}

interface SubmissionPreview {
  name: string;
  age: number | null;
  email: string;
  gender: string;
  termsAccepted: boolean;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function UncontrolledRegistrationForm(): React.JSX.Element {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState<SubmissionPreview | null>(null);
  const [status, setStatus] = useState<string>('');

  const validate = useCallback((fd: FormData): FieldErrors => {
    const next: FieldErrors = {};
    const rawName = fd.get('name');
    const rawAge = fd.get('age');
    const rawEmail = fd.get('email');
    const rawGender = fd.get('gender');
    const terms = fd.get('terms');

    const name = typeof rawName === 'string' ? rawName.trim() : '';
    const ageRaw = typeof rawAge === 'string' ? rawAge.trim() : '';
    const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';
    const gender = typeof rawGender === 'string' ? rawGender : '';

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

    return next;
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const validation = validate(fd);
      setErrors(validation);
      if (Object.keys(validation).length > 0) {
        setStatus('');
        return;
      }
      const rawName = fd.get('name');
      const rawAge = fd.get('age');
      const rawEmail = fd.get('email');
      const rawGender = fd.get('gender');
      const preview: SubmissionPreview = {
        name: typeof rawName === 'string' ? rawName.trim() : '',
        age: typeof rawAge === 'string' ? Number(rawAge.trim()) : null,
        email: typeof rawEmail === 'string' ? rawEmail.trim() : '',
        gender: typeof rawGender === 'string' ? rawGender : '',
        termsAccepted: fd.get('terms') === 'on',
      };
      setSubmitted(preview);
      setStatus('forms.status.submitted_temp');
      // eslint-disable-next-line no-console
      console.log('[Phase3] Uncontrolled submission preview', preview);
    },
    [validate]
  );

  const fieldError = (key: keyof FieldErrors): string | undefined =>
    errors[key];

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="space-y-4"
      aria-describedby="modal-status-region"
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {status}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="un_name" className="font-medium text-sm">
          forms.labels.name
        </label>
        <input
          id="un_name"
          name="name"
          type="text"
          placeholder="forms.placeholders.name"
          className="rounded border px-3 py-2 text-sm bg-white dark:bg-blue-900/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
          aria-invalid={!!fieldError('name')}
          aria-describedby={fieldError('name') ? 'err-name' : undefined}
        />
        {fieldError('name') && (
          <p id="err-name" className="text-xs text-red-600 min-h-4">
            {fieldError('name')}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="un_age" className="font-medium text-sm">
          forms.labels.age
        </label>
        <input
          id="un_age"
          name="age"
          type="number"
          min={0}
          className="rounded border px-3 py-2 text-sm bg-white dark:bg-blue-900/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
          aria-invalid={!!fieldError('age')}
          aria-describedby={fieldError('age') ? 'err-age' : undefined}
        />
        {fieldError('age') && (
          <p id="err-age" className="text-xs text-red-600 min-h-4">
            {fieldError('age')}
          </p>
        )}
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
          className="rounded border px-3 py-2 text-sm bg-white dark:bg-blue-900/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
          aria-invalid={!!fieldError('email')}
          aria-describedby={fieldError('email') ? 'err-email' : undefined}
        />
        {fieldError('email') && (
          <p id="err-email" className="text-xs text-red-600 min-h-4">
            {fieldError('email')}
          </p>
        )}
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="font-medium text-sm">forms.labels.gender</legend>
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
          <p id="err-gender" className="text-xs text-red-600 min-h-4">
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
          className="mt-0.5 h-4 w-4 rounded border text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        />
        <label htmlFor="un_terms" className="text-sm leading-snug">
          forms.labels.terms
        </label>
      </div>
      {fieldError('terms') && (
        <p id="err-terms" className="text-xs text-red-600 min-h-4">
          {fieldError('terms')}
        </p>
      )}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded bg-green-600 text-white px-4 py-2 text-sm font-medium shadow hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
        >
          forms.labels.submit
        </button>
        <button
          type="reset"
          onClick={() => {
            setErrors({});
            setStatus('');
            setSubmitted(null);
          }}
          className="rounded bg-gray-200 dark:bg-blue-900/40 text-gray-900 dark:text-gray-100 px-4 py-2 text-sm font-medium shadow hover:bg-gray-300 dark:hover:bg-blue-800/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
        >
          forms.labels.reset
        </button>
      </div>
      {submitted && (
        <pre className="mt-4 max-h-40 overflow-auto rounded bg-gray-900/90 text-[10px] text-green-300 p-3">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </form>
  );
}
