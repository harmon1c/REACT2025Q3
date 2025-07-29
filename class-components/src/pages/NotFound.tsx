import React from 'react';
import { Link } from 'react-router-dom';
import { Main } from '../components/Main';

export const NotFound: React.FC = () => {
  return (
    <Main>
      <div className="text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <img
              src="/img/gif/404-img.gif"
              alt="404 Error"
              className="w-64 h-auto mx-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-gray-600">
              Page Not Found
            </h2>
            <p className="text-md text-gray-500 max-w-md">
              The page you&apos;re looking for doesn&apos;t exist. It might have
              moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              to="/"
              className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Go Home
            </Link>
            <Link
              to="/about"
              className="px-8 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <p>Popular searches: pikachu, charizard, bulbasaur</p>
          </div>
        </div>
      </div>
    </Main>
  );
};
