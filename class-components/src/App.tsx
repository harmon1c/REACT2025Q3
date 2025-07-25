import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import PokemonDetailPanel from './pages/PokemonDetailPanel';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="" element={<Home />}>
                <Route
                  path="details/:pokemonName"
                  element={<PokemonDetailPanel />}
                />
              </Route>
              <Route path=":page" element={<Home />}>
                <Route
                  path="details/:pokemonName"
                  element={<PokemonDetailPanel />}
                />
              </Route>
              <Route path="about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;
