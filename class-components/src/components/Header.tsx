import { getTranslations } from 'next-intl/server';
import HeaderClient from './HeaderClient';

interface HeaderProps {
  locale?: string;
}

export async function Header({
  locale,
}: HeaderProps = {}): Promise<React.JSX.Element> {
  const t = await getTranslations({ locale: locale ?? 'en', namespace: 'nav' });
  return (
    <header className="header bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white w-screen dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-100">
      <div className="w-full max-w-[1440px] mx-auto px-4">
        <HeaderClient
          homeLabel={t('home')}
          aboutLabel={t('about')}
          switchToRussianLabel={t('switchToRussian')}
          switchToEnglishLabel={t('switchToEnglish')}
        />
      </div>
    </header>
  );
}
