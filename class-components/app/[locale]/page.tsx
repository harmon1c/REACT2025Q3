import { useTranslations } from 'next-intl';

export default function HomePage(): React.JSX.Element {
  const t = useTranslations('nav');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Pokemon Catalog</h1>
        <p className="text-center text-lg">
          {t('home')} - Migration to Next.js in progress...
        </p>
      </div>
    </div>
  );
}
