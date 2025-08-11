import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '../context/ThemeContext';
import HeaderClient from './HeaderClient';

vi.mock('@/navigation', () => ({
  usePathname: (): string => '/en',
  useRouter: (): { push: (p: string, opts?: unknown) => void } => ({
    push: vi.fn(),
  }),
  useSearchParams: (): URLSearchParams => new URLSearchParams(),
  Link: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }): React.ReactElement => <a href={href}>{children}</a>,
}));
vi.mock('next-intl', () => ({ useLocale: (): string => 'en' }));
vi.mock('@/hooks/useHasMounted', () => ({
  useHasMounted: (): boolean => true,
}));
const mockSetTheme = vi.fn();
vi.mock('@/context/useTheme', () => ({
  useTheme: (): { theme: string; setTheme: (t: string) => void } => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

function renderHeader(): ReturnType<typeof render> {
  return render(
    <ThemeProvider>
      <header>
        <HeaderClient
          homeLabel="Home"
          aboutLabel="About"
          switchToRussianLabel="Switch to Russian"
          switchToEnglishLabel="Switch to English"
        />
      </header>
    </ThemeProvider>
  );
}

describe('HeaderClient accessibility', () => {
  it('renders logo and navigation links', () => {
    renderHeader();
    expect(screen.getByText('Pokemon Explorer')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  });

  it('has theme toggle button with accessible name', () => {
    renderHeader();
    const button = screen.getByRole('button', {
      name: /switch to dark theme|switch to light theme/i,
    });
    expect(button).toBeInTheDocument();
  });
});
