import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createAppStore } from '@/store';
import { UncontrolledRegistrationForm } from './UncontrolledRegistrationForm';

vi.mock('next-intl', () => ({
  useTranslations: () => {
    return (key: string): string => {
      return key;
    };
  },
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
      <UncontrolledRegistrationForm onSuccess={onSuccess} />
    </Provider>
  );
  return { store, onSuccess };
}

describe('UncontrolledRegistrationForm', () => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  it('shows validation errors on submit then disables submit while errors exist', async () => {
    const user = userEvent.setup();
    setup();
    const submitBtn = screen.getByRole('button', {
      name: /forms.labels.submit/i,
    });
    await user.click(submitBtn);
    const nameErr =
      screen.queryByText('forms.errors.name_required') ??
      screen.getByText('forms.errors.name_capital');
    expect(nameErr).toBeInTheDocument();
    const ageErr =
      screen.queryByText('forms.errors.age_required') ??
      screen.getByText('forms.errors.age_number');
    expect(ageErr).toBeInTheDocument();
    expect(await screen.findByText('forms.errors.password_weak')).toBeVisible();
    expect(
      await screen.findByText('forms.errors.confirm_password_required')
    ).toBeVisible();
    expect(
      await screen.findByText('forms.errors.gender_required')
    ).toBeVisible();
    expect(
      await screen.findByText(/forms\.errors\.country_(required|invalid)/)
    ).toBeVisible();
    expect(
      await screen.findByText(/forms\.errors\.email_(required|invalid)/)
    ).toBeVisible();
    expect(
      await screen.findByText('forms.errors.terms_required')
    ).toBeVisible();
    expect(submitBtn).toBeDisabled();
  });

  it('submits successfully when valid data provided', async () => {
    const user = userEvent.setup();
    const { onSuccess } = setup();
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
    expect(genderFieldset).not.toBeNull();
    if (genderFieldset) {
      const firstRadio = within(genderFieldset).getAllByRole('radio')[0];
      await user.click(firstRadio);
    }
    const countryInput = screen.getByPlaceholderText(
      'forms.placeholders.country'
    );
    await user.type(countryInput, 'Canada');
    await user.click(screen.getByLabelText('forms.labels.terms'));
    const submitBtn = screen.getByRole('button', {
      name: /forms.labels.submit/i,
    });
    await user.click(submitBtn);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/alex@example.com/i)).toBeInTheDocument();
  });
});
