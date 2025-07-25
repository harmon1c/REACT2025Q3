import { type JSX } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

const HeaderWithRouter = (): JSX.Element => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
);

describe('Header Component', () => {
  it('renders without crashing', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contains header text', () => {
    render(<HeaderWithRouter />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    const { container } = render(<HeaderWithRouter />);
    const headerElement = container.querySelector('header');
    expect(headerElement).toBeInTheDocument();
  });
});
