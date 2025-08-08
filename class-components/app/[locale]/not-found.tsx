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
    <div className="h-full flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
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

        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
          {t('title')}
        </h2>

        <p className="text-xl text-gray-300 mb-4 leading-relaxed">
          {t('description')}
        </p>

        <Link
          href="/"
          className="inline-flex items-center px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          {t('goHome')}
        </Link>

        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <p className="text-gray-300 mb-3">{t('popularSearches')}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularPokemon.map((pokemon) => (
              <Link
                key={pokemon}
                href={`/?search=${pokemon}`}
                className="px-3 py-1 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition-colors capitalize border border-white/30"
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
