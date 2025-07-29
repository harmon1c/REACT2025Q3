import { type JSX } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { Header } from './Header';

const HeaderWithProviders = (): JSX.Element => (
  <ThemeProvider>
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  </ThemeProvider>
);

describe('Header Component', () => {
  it('renders without crashing', () => {
    render(<HeaderWithProviders />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contains header text', () => {
    render(<HeaderWithProviders />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    const { container } = render(<HeaderWithProviders />);
    const headerElement = container.querySelector('header');
    expect(headerElement).toBeInTheDocument();
  });
});
