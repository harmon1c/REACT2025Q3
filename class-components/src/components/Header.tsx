import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="header bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white w-screen">
      <div className="w-full max-w-[1440px] mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="header__logo">
            <Link to="/" className="text-2xl font-bold">
              Pokemon Explorer
            </Link>
          </div>
          <nav className="nav">
            <ul className="nav__list flex space-x-8">
              <li className="nav__list-item">
                <Link
                  to="/"
                  className={`nav__list-link px-3 py-2 rounded-lg transition-colors duration-200 ${
                    location.pathname === '/'
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li className="nav__list-item">
                <Link
                  to="/about"
                  className={`nav__list-link px-3 py-2 rounded-lg transition-colors duration-200 ${
                    location.pathname === '/about'
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
