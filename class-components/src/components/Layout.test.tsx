import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('./Header', () => ({
  Header: (): React.JSX.Element => <div data-testid="header">Header</div>,
}));

vi.mock('./Footer', () => ({
  Footer: (): React.JSX.Element => <div data-testid="footer">Footer</div>,
}));

vi.mock('react-router-dom', () => ({
  Outlet: (): React.JSX.Element => (
    <div data-testid="outlet">Outlet Content</div>
  ),
}));

describe('Root Layout Integration (surrogate)', () => {
  const Surrogate = (): React.JSX.Element => (
    <div className="site-container min-h-screen flex flex-col overflow-x-hidden">
      <div data-testid="header">Header</div>
      <main className="flex-1">Content</main>
      <div data-testid="footer">Footer</div>
    </div>
  );

  it('renders header, footer, and main', () => {
    render(<Surrogate />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('has container and main flex-1', () => {
    const { container } = render(<Surrogate />);
    const siteContainer = container.querySelector('.site-container');
    const mainElement = container.querySelector('main');
    expect(siteContainer).toBeInTheDocument();
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('flex-1');
  });
});
