import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../context/ThemeContext';
import HeaderClient from './HeaderClient';

const pushMock = vi.fn();

const localeRef = { current: 'en' };
const hasMountedRef = { current: true };
const themeRef = { current: 'light' };

vi.mock('@/navigation', () => ({
  usePathname: (): string => '/en/about',
  useRouter: (): { push: (p: string) => void } => ({ push: pushMock }),
  useSearchParams: (): URLSearchParams => new URLSearchParams('q=test'),
  Link: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }): React.ReactElement => <a href={href}>{children}</a>,
}));
vi.mock('next-intl', () => ({ useLocale: (): string => localeRef.current }));
vi.mock('@/hooks/useHasMounted', () => ({
  useHasMounted: (): boolean => hasMountedRef.current,
}));
const setThemeMock = vi.fn((t: string) => {
  themeRef.current = t;
});
vi.mock('@/context/useTheme', () => ({
  useTheme: (): { theme: string; setTheme: (t: string) => void } => ({
    theme: themeRef.current,
    setTheme: setThemeMock,
  }),
}));

function renderHeader(): ReturnType<typeof render> {
  return render(
    <ThemeProvider>
      <HeaderClient
        homeLabel="Home"
        aboutLabel="About"
        switchToRussianLabel="Switch to Russian"
        switchToEnglishLabel="Switch to English"
      />
    </ThemeProvider>
  );
}

describe('HeaderClient branches', () => {
  it('switchLocale en -> ru', async () => {
    hasMountedRef.current = true;
    localeRef.current = 'en';
    renderHeader();
    const localeBtn = screen.getByRole('button', { name: 'RU' });
    await userEvent.click(localeBtn);
    expect(pushMock).toHaveBeenCalledTimes(1);
  });

  it('switchLocale ru -> en', async () => {
    pushMock.mockClear();
    hasMountedRef.current = true;
    localeRef.current = 'ru';
    renderHeader();
    const localeBtn = screen.getByRole('button', { name: 'EN' });
    await userEvent.click(localeBtn);
    expect(pushMock).toHaveBeenCalledTimes(1);
  });

  it('renders placeholders when not mounted', () => {
    hasMountedRef.current = false;
    renderHeader();
    expect(
      screen.getByRole('button', { name: 'Uncontrolled Form' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'RHF Form' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /switch to dark theme/i })
    ).toBeNull();
    expect(screen.queryByRole('button', { name: 'RU' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'EN' })).toBeNull();
    hasMountedRef.current = true;
  });

  it('toggles theme dark then light', async () => {
    hasMountedRef.current = true;
    const { rerender } = renderHeader();
    const themeBtn = screen.getByRole('button', {
      name: 'Switch to dark theme',
    });
    await userEvent.click(themeBtn);
    expect(setThemeMock).toHaveBeenCalledWith('dark');
    themeRef.current = 'dark';
    rerender(
      <ThemeProvider>
        <HeaderClient
          homeLabel="Home"
          aboutLabel="About"
          switchToRussianLabel="Switch to Russian"
          switchToEnglishLabel="Switch to English"
        />
      </ThemeProvider>
    );
    const lightBtn = screen.getByRole('button', {
      name: 'Switch to light theme',
    });
    await userEvent.click(lightBtn);
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
