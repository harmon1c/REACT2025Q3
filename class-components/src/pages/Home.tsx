import React from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import PokemonList from './PokemonList';

export const Home: React.FC = () => {
  const detailsOpen = !!useMatch('/details/:name');
  return (
    <div>
      <div className="w-full max-w-[1440px] mx-auto px-4">
        <div className="flex flex-row relative min-h-[80vh] h-[calc(100vh-7.5rem)]">
          <div
            className={
              detailsOpen
                ? 'w-2/3 transition-all h-full overflow-y-auto'
                : 'w-full transition-all h-full overflow-y-auto'
            }
          >
            <PokemonList />
          </div>
          {detailsOpen && (
            <div className="w-1/3 transition-all h-full flex flex-col">
              <Outlet />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
