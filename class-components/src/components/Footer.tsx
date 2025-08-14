import React from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export async function Footer(): Promise<React.JSX.Element> {
  const t = await getTranslations();

  return (
    <footer className="footer mt-auto w-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white/90 backdrop-blur supports-[backdrop-filter]:bg-opacity-90 border-t border-white/10 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 dark:text-gray-200 dark:border-gray-800">
      <div className="w-full max-w-[1440px] mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a
              href="https://rs.school/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title={t('footer.school_link')}
            >
              <Image
                src="/img/svg/rsschool-logo.svg"
                alt={t('footer.school_alt')}
                width={64}
                height={32}
                className="w-16 h-8 dark:invert"
                priority={false}
              />
            </a>
          </div>

          <div className="text-sm text-white/80 dark:text-gray-400">
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
              <Image
                src="/img/svg/github-logo.svg"
                alt={t('footer.github_alt')}
                width={40}
                height={40}
                className="w-10 h-10 filter brightness-0 invert dark:brightness-100 dark:invert-0 dark:opacity-90"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
