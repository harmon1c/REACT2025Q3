import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createAppStore } from '@/store';
import { RHFRegistrationForm } from './RHFRegistrationForm';

vi.mock('next-intl', () => ({
  useTranslations:
    () =>
    (key: string): string =>
      key,
}));

interface SetupResult {
  store: ReturnType<typeof createAppStore>;
  onSuccess: ReturnType<typeof vi.fn>;
}
function setup(): SetupResult {
  const store = createAppStore([]);
  const onSuccess = vi.fn();
  render(
    <Provider store={store}>
      <RHFRegistrationForm onSuccess={onSuccess} />
    </Provider>
  );
  return { store, onSuccess };
}

describe('RHFRegistrationForm', () => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  it('enforces validation lifecycle and enables submit only when valid', async () => {
    const user = userEvent.setup();
    setup();
    const submitBtn = screen.getByRole('button', {
      name: /forms.labels.submit/i,
    });
    expect(submitBtn).toBeDisabled();

    const nameInput = screen.getByLabelText('forms.labels.name');
    await user.type(nameInput, 'alex');
    expect(await screen.findByText('forms.errors.name_capital')).toBeVisible();
    expect(submitBtn).toBeDisabled();

    await user.clear(nameInput);
    await user.type(nameInput, 'Alex');
    expect(screen.queryByText('forms.errors.name_capital')).toBeNull();

    const ageInput = screen.getByLabelText('forms.labels.age');
    await user.type(ageInput, '-1');
    expect(await screen.findByText('forms.errors.age_number')).toBeVisible();
    await user.clear(ageInput);
    await user.type(ageInput, '25');
    expect(screen.queryByText('forms.errors.age_number')).toBeNull();

    const emailInput = screen.getByLabelText('forms.labels.email');
    await user.type(emailInput, 'bad@');
    expect(await screen.findByText('forms.errors.email_invalid')).toBeVisible();
    await user.clear(emailInput);
    await user.type(emailInput, 'test@example.com');

    const passwordInput = screen.getByLabelText('forms.labels.password');
    await user.type(passwordInput, 'abc');
    expect(await screen.findByText('forms.errors.password_weak')).toBeVisible();
    await user.clear(passwordInput);
    await user.type(passwordInput, 'Aa1!bcde');

    const confirmInput = screen.getByLabelText('forms.labels.confirm_password');
    await user.type(confirmInput, 'Mismatch1!');
    await user.click(submitBtn);
    expect(submitBtn).toBeDisabled();
    await user.clear(confirmInput);
    await user.type(confirmInput, 'Aa1!bcde');

    const genderFieldset = screen
      .getByText('forms.labels.gender')
      .closest('fieldset');
    expect(genderFieldset).not.toBeNull();
    if (!genderFieldset) {
      throw new Error('gender fieldset not found');
    }
    const firstRadio = within(genderFieldset).getAllByRole('radio')[0];
    await user.click(firstRadio);

    const countryInput = screen.getByPlaceholderText(
      'forms.placeholders.country'
    );
    await user.type(countryInput, 'Canada');

    await user.click(screen.getByLabelText('forms.labels.terms'));

    expect(submitBtn).toBeEnabled();
  });

  it('submits successfully with valid data', async () => {
    const user = userEvent.setup();
    const { onSuccess } = setup();

    await user.type(screen.getByLabelText('forms.labels.name'), 'Alex');
    await user.type(screen.getByLabelText('forms.labels.age'), '30');
    await user.type(
      screen.getByLabelText('forms.labels.email'),
      'alex@example.com'
    );
    await user.type(screen.getByLabelText('forms.labels.password'), 'Aa1!bcde');
    await user.type(
      screen.getByLabelText('forms.labels.confirm_password'),
      'Aa1!bcde'
    );

    const genderFieldset = screen
      .getByText('forms.labels.gender')
      .closest('fieldset');
    expect(genderFieldset).not.toBeNull();
    if (!genderFieldset) {
      throw new Error('gender fieldset not found');
    }
    const firstRadio = within(genderFieldset).getAllByRole('radio')[0];
    await user.click(firstRadio);

    const countryInput = screen.getByPlaceholderText(
      'forms.placeholders.country'
    );
    await user.type(countryInput, 'Canada');

    await user.click(screen.getByLabelText('forms.labels.terms'));

    const submitBtn = screen.getByRole('button', {
      name: /forms.labels.submit/i,
    });
    expect(submitBtn).toBeEnabled();
    await user.click(submitBtn);

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('invalid submit triggers no success call and reset clears field', async () => {
    const user = userEvent.setup();
    const { onSuccess } = setup();
    const form = document.querySelector('form');
    expect(form).not.toBeNull();
    if (!form) {
      throw new Error('form not found');
    }
    fireEvent.submit(form);
    expect(onSuccess).not.toHaveBeenCalled();
    const nameInput = screen.getByLabelText('forms.labels.name');
    await user.type(nameInput, 'Alex');
    expect(nameInput).toHaveValue('Alex');
    const resetBtn = screen.getByRole('button', {
      name: /forms.labels.reset/i,
    });
    await user.click(resetBtn);
    expect(nameInput).toHaveValue('');
  });
});
