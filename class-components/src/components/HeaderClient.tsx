'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useTheme } from '@/context/useTheme';

interface HeaderClientProps {
  homeLabel: string;
  aboutLabel: string;
  switchToRussianLabel: string;
  switchToEnglishLabel: string;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({
  homeLabel,
  aboutLabel,
  switchToRussianLabel,
  switchToEnglishLabel,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const pathLocale = React.useMemo(() => {
    const seg = pathname.split('/')[1];
    return ['en', 'ru'].includes(seg) ? seg : locale;
  }, [pathname, locale]);
  const hasMounted = useHasMounted();
  const { theme, setTheme } = useTheme();

  const buildLocalizedPath = (
    targetLocale: string,
    targetPath: string
  ): string => {
    const queryString = searchParams.toString();
    const queryPart = queryString ? `?${queryString}` : '';
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const normalized = targetPath.startsWith('/')
      ? targetPath
      : `/${targetPath}`;
    return `/${targetLocale}${
      normalized === '/' ? '' : normalized
    }${queryPart}${hash}`;
  };

  const switchLocale = (nextLocale: string): void => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length && ['en', 'ru'].includes(pathSegments[0])) {
      pathSegments.shift();
    }
    const remaining = pathSegments.length ? `/${pathSegments.join('/')}` : '/';
    router.push(buildLocalizedPath(nextLocale, remaining));
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-8 flex-1 min-w-0">
        <div className="header__logo flex-shrink-0">
          <Link
            href={buildLocalizedPath(pathLocale, '/')}
            className="text-2xl font-bold whitespace-nowrap dark:text-white dark:drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
          >
            Pokemon Explorer
          </Link>
        </div>
        <nav className="nav flex-1 min-w-0">
          <ul className="nav__list flex space-x-8">
            <li className="nav__list-item">
              {((): React.ReactNode => {
                const localeRoot = `/${pathLocale}`;
                const isHome =
                  pathname === localeRoot || pathname === `${localeRoot}/`;
                return (
                  <Link
                    href={localeRoot}
                    className={`nav__list-link px-3 py-2 rounded-lg transition-colors duration-200 border border-transparent shadow-sm ${
                      isHome
                        ? 'bg-white/40 text-white font-semibold dark:bg-white/20 dark:text-white dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                        : 'text-white/80 hover:text-white hover:bg-white/20 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.18)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.10)]'
                    }`}
                  >
                    {homeLabel}
                  </Link>
                );
              })()}
            </li>
            <li className="nav__list-item">
              {((): React.ReactNode => {
                const aboutPath = `/${pathLocale}/about`;
                const isAbout =
                  pathname === aboutPath || pathname === `${aboutPath}/`;
                return (
                  <Link
                    href={aboutPath}
                    className={`nav__list-link px-3 py-2 rounded-lg transition-colors duration-200 border border-transparent shadow-sm ${
                      isAbout
                        ? 'bg-white/40 text-white font-semibold dark:bg-white/20 dark:text-white dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                        : 'text-white/80 hover:text-white hover:bg-white/20 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.18)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.10)]'
                    }`}
                  >
                    {aboutLabel}
                  </Link>
                );
              })()}
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
        {hasMounted ? (
          <button
            onClick={() => switchLocale(pathLocale === 'en' ? 'ru' : 'en')}
            className="relative rounded focus:outline-none w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
            title={
              pathLocale === 'en' ? switchToRussianLabel : switchToEnglishLabel
            }
            type="button"
          >
            <span className="text-sm font-bold text-white dark:text-gray-100">
              {pathLocale === 'en' ? 'RU' : 'EN'}
            </span>
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}
        {hasMounted ? (
          <button
            aria-label={
              theme === 'light'
                ? 'Switch to dark theme'
                : 'Switch to light theme'
            }
            className="relative rounded focus:outline-none w-10 h-10 flex items-center justify-center"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title={
              theme === 'light'
                ? 'Switch to dark theme'
                : 'Switch to light theme'
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`absolute transition-all duration-300 text-yellow-300 ${
                theme === 'light'
                  ? 'rotate-0 scale-100 opacity-100'
                  : '-rotate-90 scale-0 opacity-0'
              }`}
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`absolute transition-all duration-300 text-blue-200 ${
                theme === 'dark'
                  ? 'rotate-0 scale-100 opacity-100'
                  : 'rotate-90 scale-0 opacity-0'
              }`}
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
            <span className="sr-only">Toggle theme</span>
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}
      </div>
    </div>
  );
};

export default HeaderClient;
