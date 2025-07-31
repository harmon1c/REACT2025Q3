import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders } from './test-utils';
import App from './App';

vi.mock('./components/ErrorBoundary', () => ({
  ErrorBoundary: ({
    children,
  }: {
    children: React.ReactNode;
  }): React.JSX.Element => <div data-testid="error-boundary">{children}</div>,
}));

vi.mock('./components/Layout', () => ({
  Layout: (): React.JSX.Element => (
    <div data-testid="layout">Layout Component</div>
  ),
}));

vi.mock('./pages/Home', () => ({
  Home: (): React.JSX.Element => <div data-testid="home">Home Component</div>,
}));

vi.mock('./components/PokemonDetailPanel', () => ({
  default: (): React.JSX.Element => (
    <div data-testid="pokemon-detail">Pokemon Detail Panel</div>
  ),
}));

vi.mock('./pages/About', () => ({
  About: (): React.JSX.Element => (
    <div data-testid="about">About Component</div>
  ),
}));

vi.mock('./pages/NotFound', () => ({
  NotFound: (): React.JSX.Element => (
    <div data-testid="not-found">Not Found Component</div>
  ),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({
      children,
    }: {
      children: React.ReactNode;
    }): React.JSX.Element => <div data-testid="browser-router">{children}</div>,
    Routes: ({
      children,
    }: {
      children: React.ReactNode;
    }): React.JSX.Element => <div data-testid="routes">{children}</div>,
    Route: ({ element }: { element: React.ReactNode }): React.JSX.Element => (
      <div data-testid="route">{element}</div>
    ),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('App Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  it('renders BrowserRouter', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('browser-router')).toBeInTheDocument();
  });

  it('renders main structure with routing components', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    expect(screen.getByTestId('routes')).toBeInTheDocument();
  });

  it('has proper CSS classes for background styling', () => {
    const { container } = renderWithProviders(<App />);
    const mainDiv = container.querySelector('.min-h-screen.bg-gradient-to-br');
    expect(mainDiv).toBeInTheDocument();
    expect(mainDiv).toHaveClass(
      'from-blue-50',
      'via-indigo-50',
      'to-purple-50'
    );
  });
});
