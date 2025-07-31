import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PokemonCatalogueContainer } from '../components/PokemonCatalogueContainer';
import PokemonDetailPanel from '../components/PokemonDetailPanel';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const details = searchParams.get('details');
  const page = searchParams.get('page');
  const showDetailsPanel = !!details;

  return (
    <PokemonCatalogueContainer
      showDetailsPanel={showDetailsPanel}
      onPokemonClick={(name) => {
        const pageParam = page && Number(page) > 1 ? `page=${page}&` : '';
        navigate(`/?${pageParam}details=${encodeURIComponent(name)}`);
      }}
      detailsPanel={
        showDetailsPanel && details ? (
          <div className="w-80 shrink-0">
            <PokemonDetailPanel
              onClose={() => {
                if (page && Number(page) > 1) {
                  navigate(`/?page=${page}`);
                } else {
                  navigate('/');
                }
              }}
            />
          </div>
        ) : null
      }
    />
  );
};
