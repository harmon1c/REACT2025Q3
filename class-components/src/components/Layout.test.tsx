import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Layout } from './Layout';

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

describe('Layout Component', () => {
  it('renders header, footer, and outlet', () => {
    render(<Layout />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('has proper container structure', () => {
    const { container } = render(<Layout />);

    const siteContainer = container.querySelector('.site-container');
    expect(siteContainer).toBeInTheDocument();
    expect(siteContainer).toHaveClass('min-h-screen', 'flex', 'flex-col');
  });

  it('has main element with flex-1 class', () => {
    const { container } = render(<Layout />);

    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('flex-1');
  });
});
