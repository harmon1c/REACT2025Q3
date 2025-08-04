import React from 'react';
import { Main } from '../components/Main';

export const About: React.FC = () => {
  return (
    <Main>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          About This Application
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
              Author Information
            </h3>
            <p className="text-gray-700 dark:text-gray-200 text-lg mb-3">
              Created by <strong>Harmon1c</strong>
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              This Pokemon Explorer application was developed as part of the RS
              School React course, demonstrating modern React development
              practices including functional components, hooks, routing, and
              TypeScript integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="https://github.com/harmon1c"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <img
                  src="/img/svg/github-logo.svg"
                  alt="GitHub"
                  className="w-5 h-5 filter brightness-0 invert"
                />
                View GitHub Profile
              </a>
              <a
                href="https://app.rs.school/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <img
                  src="/img/svg/rsschool-logo.svg"
                  alt="RS School"
                  className="w-6 h-6 filter brightness-0 invert"
                />
                RS School React Course
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Application Info */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Purpose
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Pokemon Explorer is a modern React application built to demonstrate
            best practices in functional component development, routing, and
            state management. It provides an intuitive interface for searching
            and exploring Pokemon data.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Features
          </h3>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Pokemon search with real-time results
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Functional components with React hooks
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              React Router for navigation
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Error boundary for graceful error handling
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Responsive design with modern UI
            </li>
          </ul>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Technology Stack
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center border border-gray-100 dark:border-gray-700">
            <div className="font-semibold text-blue-600">React 19</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Frontend Framework
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center border border-gray-100 dark:border-gray-700">
            <div className="font-semibold text-purple-600">TypeScript</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Type Safety
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center border border-gray-100 dark:border-gray-700">
            <div className="font-semibold text-green-600">React Router</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Navigation
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center border border-gray-100 dark:border-gray-700">
            <div className="font-semibold text-cyan-600">Tailwind CSS</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Styling
            </div>
          </div>
        </div>
      </div>

      {/* Data Source */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Data Source
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          All Pokemon data is fetched from the{' '}
          <a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-semibold"
          >
            PokeAPI
          </a>
          , a comprehensive RESTful Pokemon API that provides detailed
          information about Pokemon species, abilities, types, and more.
        </p>
      </div>
    </Main>
  );
};
