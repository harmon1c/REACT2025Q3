import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="site-container min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 bg-white/80 dark:bg-blue-900/80 transition-colors duration-300">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
