import { useTranslations } from 'next-intl';
import { Main } from '@/components/Main';

export default function AboutPage(): React.JSX.Element {
  const t = useTranslations('about');

  return (
    <Main>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {t('title')}
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
      </div>

      {/* Author Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-lg mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">H</span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {t('authorInfo.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-200 text-lg mb-3">
              {t('authorInfo.createdBy')} <strong>Harmon1c</strong>
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              {t('authorInfo.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Technology Stack */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="text-2xl mr-3">⚡</span>
            {t('techStack.title')}
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-200">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Next.js 15 with App Router
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              React 19 with Hooks
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Redux Toolkit + RTK Query
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
              TypeScript
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
              Tailwind CSS
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              next-intl for i18n
            </li>
          </ul>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="text-2xl mr-3">🚀</span>
            {t('features.title')}
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-200">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              {t('features.search')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              {t('features.pagination')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              {t('features.details')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
              {t('features.selection')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
              {t('features.themes')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              {t('features.i18n')}
            </li>
          </ul>
        </div>
      </div>

      {/* API Information */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <span className="text-2xl mr-3">🌐</span>
          {t('api.title')}
        </h3>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          {t('api.description')}
        </p>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <code className="text-sm text-gray-800 dark:text-gray-200">
            https://pokeapi.co/api/v2/pokemon
          </code>
        </div>
      </div>
    </Main>
  );
}
