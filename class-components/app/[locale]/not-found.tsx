import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="text-center max-w-2xl px-6">
        <div className="relative mb-8">
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

        <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse mb-6">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-300 mb-8 text-lg">
          The page you are looking for seems to have vanished into the digital
          void.
        </p>

        <Link
          href="/"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          🏠 Go Home
        </Link>

        <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <p className="text-gray-300 mb-3">🔍 Popular searches:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['pikachu', 'charizard', 'bulbasaur', 'mewtwo', 'eevee'].map(
              (pokemon) => (
                <Link
                  key={pokemon}
                  href={`/?search=${pokemon}`}
                  className="px-3 py-1 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition-colors capitalize border border-white/30"
                >
                  {pokemon}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
