import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/useTheme';

export const Header: React.FC = () => {
  const location = useLocation();

  const { theme, setTheme } = useTheme();

  return (
    <header className="header bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white w-screen dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-100">
      <div className="w-full max-w-[1440px] mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-8 flex-1 min-w-0">
            <div className="header__logo flex-shrink-0">
              <Link
                to="/"
                className="text-2xl font-bold whitespace-nowrap dark:text-white dark:drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
              >
                Pokemon Explorer
              </Link>
            </div>
            <nav className="nav flex-1 min-w-0">
              <ul className="nav__list flex space-x-8">
                <li className="nav__list-item">
                  <Link
                    to="/"
                    className={`nav__list-link px-3 py-2 rounded-lg transition-colors duration-200 border border-transparent shadow-sm ${
                      location.pathname === '/'
                        ? 'bg-white/40 text-white font-semibold dark:bg-white/20 dark:text-white dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                        : 'text-white/80 hover:text-white hover:bg-white/20 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.18)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.10)]'
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav__list-item">
                  <Link
                    to="/about"
                    className={`nav__list-link px-3 py-2 rounded-lg transition-colors duration-200 border border-transparent shadow-sm ${
                      location.pathname === '/about'
                        ? 'bg-white/40 text-white font-semibold dark:bg-white/20 dark:text-white dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                        : 'text-white/80 hover:text-white hover:bg-white/20 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.18)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.10)]'
                    }`}
                  >
                    About
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center flex-shrink-0 ml-4">
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
                className={`absolute transition-all duration-300 text-yellow-300 ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
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
                className={`absolute transition-all duration-300 text-blue-200 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`}
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
