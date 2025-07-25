import React, { type JSX } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { About } from './About';

vi.mock('../components/Main', () => ({
  Main: ({ children }: { children: React.ReactNode }): JSX.Element => (
    <div data-testid="main">{children}</div>
  ),
}));

describe('About Page', () => {
  it('renders the about page content', (): void => {
    render(<About />);

    expect(screen.getByTestId('main')).toBeInTheDocument();
    expect(screen.getByText('About This Application')).toBeInTheDocument();
  });

  it('displays author information', (): void => {
    render(<About />);

    expect(screen.getByText('Author Information')).toBeInTheDocument();
    expect(screen.getByText(/Created by/)).toBeInTheDocument();
    expect(screen.getByText(/Harmon1c/)).toBeInTheDocument();
  });

  it('displays application description', (): void => {
    render(<About />);

    expect(screen.getByText('Purpose')).toBeInTheDocument();
    expect(screen.getAllByText(/Pokemon Explorer/)).toHaveLength(2);
  });

  it('displays technology stack information', (): void => {
    render(<About />);

    expect(screen.getByText('Technology Stack')).toBeInTheDocument();
    expect(screen.getByText('React 19')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('displays features section', (): void => {
    render(<About />);

    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders all main sections', (): void => {
    render(<About />);

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();

    expect(screen.getByText('H')).toBeInTheDocument();

    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(1);
  });
});
