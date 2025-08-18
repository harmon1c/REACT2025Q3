import { createNavigation } from 'next-intl/navigation';
import { useSearchParams } from 'next/navigation';

export const locales = ['en', 'ru'] as const;
export const localePrefix = 'always';

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales: [...locales],
  defaultLocale: 'en',
  localePrefix,
});

export { useSearchParams };
