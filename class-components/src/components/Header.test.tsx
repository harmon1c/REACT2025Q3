import { type JSX } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
  }): JSX.Element => <a href={href}>{children}</a>,
}));
vi.mock('next-intl', () => ({ useLocale: (): string => 'en' }));
vi.mock('@/hooks/useHasMounted', () => ({
  useHasMounted: (): boolean => true,
}));
vi.mock('@/context/useTheme', () => ({
  useTheme: (): { theme: string; setTheme: (t: string) => void } => ({
    theme: 'light',
    setTheme: (): void => {},
  }),
}));

const HeaderWithProviders = (): JSX.Element => (
  <ThemeProvider>
    <header>
      <HeaderClient
        homeLabel="Home"
        aboutLabel="About"
        switchToRussianLabel="RU"
        switchToEnglishLabel="EN"
      />
    </header>
  </ThemeProvider>
);

describe('HeaderClient (adapted)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<HeaderWithProviders />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    render(<HeaderWithProviders />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});
