import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAppStore } from '@/store';
import { FormsDemoClient } from './FormsDemoClient';

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => {
    return (key: string, values?: Record<string, unknown>): string => {
      if (values && typeof values.count === 'number') {
        return `${ns ? ns + '.' : ''}${key}:${values.count}`;
      }
      return `${ns ? ns + '.' : ''}${key}`;
    };
  },
}));

function setup(): void {
  const store = createAppStore([]);
  render(
    <Provider store={store}>
      <FormsDemoClient />
    </Provider>
  );
}

describe('Forms integration highlight / flash behaviour', () => {
  it('shows pulse highlight on new uncontrolled submission', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(
      screen.getByRole('button', { name: /Open Uncontrolled Form/i })
    );
    await user.type(screen.getByLabelText('forms.labels.name'), 'Alex');
    await user.type(screen.getByLabelText('forms.labels.age'), '30');
    await user.type(screen.getByLabelText('forms.labels.password'), 'Aa1!bcde');
    await user.type(
      screen.getByLabelText('forms.labels.confirm_password'),
      'Aa1!bcde'
    );
    await user.type(
      screen.getByLabelText('forms.labels.email'),
      'alex@example.com'
    );
    const genderFieldset = screen
      .getByText('forms.labels.gender')
      .closest('fieldset');
    if (!genderFieldset) {
      throw new Error('gender fieldset missing');
    }
    await user.click(within(genderFieldset).getAllByRole('radio')[0]);
    await user.type(
      screen.getByPlaceholderText('forms.placeholders.country'),
      'Canada'
    );
    await user.click(screen.getByLabelText('forms.labels.terms'));
    await user.click(
      screen.getByRole('button', { name: /forms.labels.submit/i })
    );

    const submissionCard = await screen.findByText(/alex@example.com/i);
    const innerContainer = submissionCard.closest('div');
    const outerCard = innerContainer?.parentElement;
    expect(outerCard?.className).toMatch(/animate-pulse/);
  });
});
