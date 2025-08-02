import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { NotFound } from './NotFound';

vi.mock('../components/Main', () => ({
  Main: ({ children }: { children: React.ReactNode }): React.ReactElement => (
    <div data-testid="main">{children}</div>
  ),
}));

const NotFoundWithRouter = (): React.ReactElement => (
  <BrowserRouter>
    <NotFound />
  </BrowserRouter>
);

describe('NotFound Page', () => {
  it('renders the 404 page content', (): void => {
    render(<NotFoundWithRouter />);

    expect(screen.getByTestId('main')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('displays the 404 error message', (): void => {
    render(<NotFoundWithRouter />);

    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('displays the error image', (): void => {
    render(<NotFoundWithRouter />);

    const image = screen.getByAltText('404 Error');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/img/gif/404-img.gif');
  });

  it('displays a link to go back home', (): void => {
    render(<NotFoundWithRouter />);

    const homeLink = screen.getByRole('link', { name: 'Go Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('displays descriptive text', (): void => {
    render(<NotFoundWithRouter />);

    expect(
      screen.getByText(/the page you're looking for doesn't exist/i)
    ).toBeInTheDocument();
  });

  it('renders all main elements', (): void => {
    render(<NotFoundWithRouter />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();

    expect(screen.getAllByRole('link')).toHaveLength(2);
  });
});
