import { getTranslations } from 'next-intl/server';
import HeaderClient from './HeaderClient';

interface HeaderProps {
  locale?: string;
}

export async function Header({
  locale,
}: HeaderProps = {}): Promise<React.JSX.Element> {
  const effectiveLocale = locale ?? 'en';
  const t = await getTranslations({
    locale: effectiveLocale,
    namespace: 'nav',
  });
  const uiT = await getTranslations({
    locale: effectiveLocale,
    namespace: 'ui',
  });
  return (
    <header className="header w-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white/95 backdrop-blur supports-[backdrop-filter]:bg-opacity-90 shadow-sm border-b border-white/10 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-850 dark:to-gray-950 dark:text-gray-100 dark:border-gray-800 dark:shadow-md">
      <div className="w-full max-w-[1440px] mx-auto px-4">
        <HeaderClient
          homeLabel={t('home')}
          aboutLabel={t('about')}
          switchToRussianLabel={t('switchToRussian')}
          switchToEnglishLabel={t('switchToEnglish')}
          uncontrolledBtnLabel={uiT('open_uncontrolled')}
          rhfBtnLabel={uiT('open_rhf')}
        />
      </div>
    </header>
  );
}
