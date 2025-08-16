import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAppStore } from '@/store';
import { RHFRegistrationForm } from './RHFRegistrationForm';

vi.mock('next-intl', () => ({
  useTranslations() {
    return (key: string): string => key;
  },
}));

describe('RHFRegistrationForm password strength meter integration', () => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  function setup(): void {
    const store = createAppStore([]);
    render(
      <Provider store={store}>
        <RHFRegistrationForm />
      </Provider>
    );
  }

  it('updates strength status text as password complexity increases', async () => {
    setup();
    const user = userEvent.setup();
    const pwd = screen.getByLabelText('forms.labels.password');

    expect(screen.getByText('forms.status.strength_0')).toBeInTheDocument();

    await user.type(pwd, 'a'); // still very weak (only lower)
    expect(screen.getByText('forms.status.strength_0')).toBeInTheDocument();

    await user.clear(pwd);
    await user.type(pwd, 'aA'); // lower + upper
    expect(screen.getByText('forms.status.strength_1')).toBeInTheDocument();

    await user.clear(pwd);
    await user.type(pwd, 'aA1'); // + digit
    expect(screen.getByText('forms.status.strength_2')).toBeInTheDocument();

    await user.clear(pwd);
    await user.type(pwd, 'aA1!'); // + special
    expect(screen.getByText('forms.status.strength_3')).toBeInTheDocument();

    await user.clear(pwd);
    await user.type(pwd, 'aA1!xxxx'); // + length threshold
    expect(screen.getByText('forms.status.strength_4')).toBeInTheDocument();
  });
});
