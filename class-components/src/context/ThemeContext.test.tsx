import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { JSX } from 'react';
import { ThemeProvider } from './ThemeContext';
import { useTheme } from './useTheme';

function ThemeConsumerTest(): JSX.Element {
  const { theme, setTheme, userSelected } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="userSelected">{userSelected ? 'true' : 'false'}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  );
}

describe('ThemeProvider and useTheme', () => {
  it('provides default theme and allows switching', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumerTest />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme').textContent).toMatch(/light|dark/);
    expect(screen.getByTestId('userSelected').textContent).toBe('false');
    await userEvent.click(screen.getByText('Set Dark'));
    expect(await screen.findByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('userSelected').textContent).toBe('true');
    await userEvent.click(screen.getByText('Set Light'));
    expect(await screen.findByTestId('theme')).toHaveTextContent('light');
    expect(screen.getByTestId('userSelected').textContent).toBe('true');
  });

  it('throws if useTheme is used outside ThemeProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function BadComponent(): JSX.Element | null {
      useTheme();
      return null;
    }
    expect(() => render(<BadComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
    spy.mockRestore();
  });
});
