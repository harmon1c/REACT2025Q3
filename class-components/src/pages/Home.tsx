import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PokemonCatalogueContainer } from '../components/PokemonCatalogueContainer';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasDetails = location.pathname.includes('/details/');

  return (
    <PokemonCatalogueContainer
      showDetailsPanel={hasDetails}
      onPokemonClick={(name) => navigate(`/details/${name}`)}
      detailsPanel={
        hasDetails ? (
          <div className="w-80 shrink-0">
            <Outlet />
          </div>
        ) : null
      }
    />
  );
};
