import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createAppStore } from '@/store';
import { CountriesAutocomplete } from './CountriesAutocomplete';

vi.mock('next-intl', () => ({
  useTranslations:
    () =>
    (k: string): string =>
      k,
}));

describe('CountriesAutocomplete keyboard interactions', () => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  function setup(initial?: string): void {
    const store = createAppStore([]);
    const Wrapper = (): React.JSX.Element => {
      const [value, setValue] = React.useState(initial || '');
      return (
        <Provider store={store}>
          <CountriesAutocomplete value={value} onChange={setValue} />
        </Provider>
      );
    };
    render(<Wrapper />);
  }

  it('navigates list with arrow keys and selects with Enter', async () => {
    const user = userEvent.setup();
    setup();
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.type(input, 'can');

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    const combobox = screen.getByRole('combobox');
    const activeId = combobox.getAttribute('aria-activedescendant');
    expect(activeId).not.toBeNull();

    await user.keyboard('{Enter}');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes list with Escape', async () => {
    const user = userEvent.setup();
    setup();
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.type(input, 'uni');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    await user.keyboard('{Escape}');
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });
});
