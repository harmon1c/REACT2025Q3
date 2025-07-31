import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import PokemonDetailPanel from './components/PokemonDetailPanel';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

function App(): React.JSX.Element {
  const selectedItems = useAppSelector((state) => state.selectedItems.items);

  useEffect(() => {
    window.localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
  }, [selectedItems]);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-100">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="" element={<Home />}>
                  <Route
                    path="details/:pokemonName"
                    element={<PokemonDetailPanel />}
                  />
                </Route>
                <Route path=":page(\\d+)" element={<Home />}>
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
    </ThemeProvider>
  );
}

export default App;
