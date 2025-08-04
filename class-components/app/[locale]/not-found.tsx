import Link from 'next/link';

export default function NotFound(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
