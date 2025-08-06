'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export const Footer: React.FC = () => {
  const t = useTranslations();

  return (
    <footer className="footer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white mt-auto w-screen dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-100">
      <div className="w-full max-w-[1440px] mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a
              href="https://rs.school/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title={t('footer.school_link')}
            >
              <img
                src="/img/svg/rsschool-logo.svg"
                alt={t('footer.school_alt')}
                className="w-16 h-8 dark:invert"
              />
            </a>
          </div>

          <div className="text-sm text-white/80 dark:text-gray-300">
            {t('footer.copyright')}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/harmon1c"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title={t('footer.github_link')}
            >
              <img
                src="/img/svg/github-logo.svg"
                alt={t('footer.github_alt')}
                className="w-10 h-10 filter brightness-0 invert"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
