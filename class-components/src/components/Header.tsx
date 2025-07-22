import React from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="text-center mb-12">
      <div className="relative">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">{title}</h1>
      </div>
      <div className="mt-6 mx-auto">
        <p className="text-xl text-gray-600 leading-relaxed">
          Discover and explore Pokemon using the Pokemon API
        </p>
        <div className="mt-4 flex justify-center space-x-2">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
          <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
          <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
        </div>
      </div>
    </header>
  );
};
