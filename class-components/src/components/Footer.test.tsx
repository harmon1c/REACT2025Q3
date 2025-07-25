import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './Footer';

describe('Footer Component', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('contains copyright information', () => {
    render(<Footer />);
    expect(screen.getByText('© 2025')).toBeInTheDocument();
  });

  it('has RS School link', () => {
    render(<Footer />);
    const rsLink = screen.getByRole('link', { name: /rs school/i });
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/');
  });

  it('has GitHub link', () => {
    render(<Footer />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/harmon1c');
  });
});
