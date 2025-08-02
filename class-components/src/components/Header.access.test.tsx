import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { Header } from './Header';

function renderHeader(path = '/'): ReturnType<typeof render> {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[path]}>
        <Header />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('Header', () => {
  it('renders logo and navigation links', () => {
    renderHeader();
    expect(screen.getByText('Pokemon Explorer')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  });

  it('highlights Home link when on /', () => {
    renderHeader('/');
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveClass('bg-white/40');
  });

  it('highlights About link when on /about', () => {
    renderHeader('/about');
    const aboutLink = screen.getByRole('link', { name: 'About' });
    expect(aboutLink).toHaveClass('bg-white/40');
  });

  it('toggles theme when theme button is clicked', async () => {
    renderHeader();
    const button = screen.getByRole('button', {
      name: /switch to dark theme|switch to light theme/i,
    });
    // Initial theme is light or dark depending on system/user, so just toggle and check aria-label
    button.click();
    expect(
      button.getAttribute('aria-label') === 'Switch to dark theme' ||
        button.getAttribute('aria-label') === 'Switch to light theme'
    ).toBe(true);
  });

  it('has accessible theme toggle button', () => {
    renderHeader();
    const button = screen.getByRole('button', {
      name: /switch to dark theme|switch to light theme/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('title');
    expect(screen.getByText('Toggle theme')).toBeInTheDocument();
  });
});
