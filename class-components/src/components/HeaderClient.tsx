'use client';
import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname, useRouter, useSearchParams } from '@/navigation';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useTheme } from '@/context/useTheme';
import { Modal } from '@/features/forms/components/Modal';
import { UncontrolledRegistrationForm } from '@/features/forms/uncontrolled/UncontrolledRegistrationForm';
import { RHFRegistrationForm } from '@/features/forms/rhf/RHFRegistrationForm';

interface HeaderClientProps {
  homeLabel: string;
  aboutLabel: string;
  switchToRussianLabel: string;
  switchToEnglishLabel: string;
  uncontrolledBtnLabel?: string;
  rhfBtnLabel?: string;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({
  homeLabel,
  aboutLabel,
  switchToRussianLabel,
  switchToEnglishLabel,
  uncontrolledBtnLabel = 'Uncontrolled Form',
  rhfBtnLabel = 'RHF Form',
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const pathLocale = locale;
  const hasMounted = useHasMounted();
  const { theme, setTheme } = useTheme();
  const [openForm, setOpenForm] = useState<null | 'uncontrolled' | 'rhf'>(null);

  const switchLocale = (nextLocale: string): void => {
    if (nextLocale === locale) {
      return;
    }
    const qs = searchParams.toString();
    const stripped = (pathname || '/').replace(/^\/(en|ru)(?=\/|$)/, '') || '/';
    const target = qs ? `${stripped}?${qs}` : stripped;
    router.push(target, { locale: nextLocale });
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-8 flex-1 min-w-0">
        <div className="header__logo flex-shrink-0">
          <Link
            href="/"
            locale={pathLocale}
            className="text-2xl font-bold whitespace-nowrap dark:text-white dark:drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
          >
            Pokemon Explorer
          </Link>
        </div>
        <nav className="nav flex-1 min-w-0">
          <ul className="nav__list flex space-x-6 items-center">
            <li className="nav__list-item">
              {((): React.ReactNode => {
                const isHome =
                  pathname === `/${pathLocale}` ||
                  pathname === `/${pathLocale}/`;
                return (
                  <Link
                    href="/"
                    locale={pathLocale}
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
                const isAbout = pathname.startsWith(aboutPath);
                return (
                  <Link
                    href="/about"
                    locale={pathLocale}
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
            <li className="nav__list-item flex items-center gap-2">
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setOpenForm('uncontrolled')}
                className="px-3 py-2 rounded-md text-xs font-medium bg-blue-600 text-white shadow hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 motion-safe:transition-colors"
              >
                {uncontrolledBtnLabel}
              </button>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setOpenForm('rhf')}
                className="px-3 py-2 rounded-md text-xs font-medium bg-purple-600 text-white shadow hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 motion-safe:transition-colors"
              >
                {rhfBtnLabel}
              </button>
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
      {/* Modals rendered via portal (accessible). */}
      <Modal
        open={openForm === 'uncontrolled'}
        onClose={() => setOpenForm(null)}
        title="Uncontrolled Form"
      >
        <UncontrolledRegistrationForm onSuccess={() => setOpenForm(null)} />
      </Modal>
      <Modal
        open={openForm === 'rhf'}
        onClose={() => setOpenForm(null)}
        title="RHF Form"
      >
        <RHFRegistrationForm onSuccess={() => setOpenForm(null)} />
      </Modal>
    </div>
  );
};

export default HeaderClient;
