'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function NotFound(): React.JSX.Element {
  const t = useTranslations('notFound');

  const popularPokemon = [
    'pikachu',
    'charizard',
    'bulbasaur',
    'squirtle',
    'mewtwo',
  ];

  return (
    <div className="h-full flex items-center justify-center p-6 bg-white text-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 dark:text-white">
      <div className="text-center max-w-2xl px-2">
        <div className="relative mb-4">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-lg opacity-20 animate-pulse"></div>
          <Image
            src="/img/gif/404-img.gif"
            alt="404 Error Animation"
            width={300}
            height={300}
            className="relative w-72 h-auto mx-auto rounded-2xl shadow-2xl"
            unoptimized
            priority
          />
        </div>

        <div className="relative mb-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            404
          </h1>
        </div>

        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 dark:text-white">
          {t('title')}
        </h2>

        <p className="text-xl text-gray-600 mb-4 leading-relaxed dark:text-gray-300">
          {t('description')}
        </p>

        <Link
          href="/"
          className="inline-flex items-center px-8 py-2 bg-blue-100 text-blue-800 font-semibold rounded-xl hover:bg-blue-200 transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-1 dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-600 dark:text-white dark:hover:from-blue-600 dark:hover:to-purple-700 dark:shadow-lg dark:hover:shadow-xl"
        >
          {t('goHome')}
        </Link>

        <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 dark:bg-white/10 dark:backdrop-blur-sm dark:border-white/20">
          <p className="text-gray-600 mb-3 dark:text-gray-300">
            {t('popularSearches')}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularPokemon.map((pokemon) => (
              <Link
                key={pokemon}
                href={`/?search=${pokemon}`}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors capitalize border border-blue-200 dark:bg-white/20 dark:text-white dark:hover:bg-white/30 dark:border-white/30"
              >
                {pokemon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
