import { describe, it, expect, vi } from 'vitest';
import { locales, localePrefix } from './navigation';

vi.mock('next-intl/navigation', () => ({
  createNavigation: (): {
    Link: () => null;
    redirect: () => void;
    usePathname: () => string;
    useRouter: () => { push: (p: string) => void };
  } => ({
    Link: (): null => null,
    redirect: (): void => undefined,
    usePathname: (): string => '/',
    useRouter: (): { push: (p: string) => void } => ({
      push: (): void => undefined,
    }),
  }),
}));
vi.mock('next/navigation', () => ({
  useSearchParams: (): URLSearchParams => new URLSearchParams(),
}));

describe('navigation exports', () => {
  it('exposes locales', (): void => {
    expect(locales).toEqual(['en', 'ru']);
  });
  it('has localePrefix always', (): void => {
    expect(localePrefix).toBe('always');
  });
});
