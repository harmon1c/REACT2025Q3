import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAppStore } from '@/store';
import { UncontrolledRegistrationForm } from '../uncontrolled/UncontrolledRegistrationForm';

vi.mock('next-intl', () => ({
  useTranslations() {
    return (key: string): string => key;
  },
}));

function setup(): void {
  const store = createAppStore([]);
  render(
    <Provider store={store}>
      <UncontrolledRegistrationForm />
    </Provider>
  );
}

describe('CountriesAutocomplete validation', () => {
  it('flags invalid country value on submit', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(screen.getByLabelText('forms.labels.name'), 'Alex');
    await user.type(screen.getByLabelText('forms.labels.age'), '22');
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
      throw new Error('gender fieldset not found');
    }
    await user.click(within(genderFieldset).getAllByRole('radio')[0]);
    await user.type(
      screen.getByPlaceholderText('forms.placeholders.country'),
      'Atlantis'
    );
    await user.click(screen.getByLabelText('forms.labels.terms'));
    await user.click(
      screen.getByRole('button', { name: /forms.labels.submit/i })
    );
    expect(
      await screen.findByText('forms.errors.country_invalid')
    ).toBeInTheDocument();
  });
});
