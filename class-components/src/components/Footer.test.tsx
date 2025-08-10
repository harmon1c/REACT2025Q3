import type React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Footer } from './Footer';

vi.mock('next-intl/server', () => ({
  getTranslations:
    async () =>
    (key: string): string => {
      const map: Record<string, string> = {
        'footer.school_link': 'RS School Link',
        'footer.school_alt': 'RS School',
        'footer.github_link': 'GitHub Link',
        'footer.github_alt': 'GitHub',
        'footer.copyright': '© 2025',
      };
      return map[key] ?? key;
    },
}));
const AsyncFooter = async (): Promise<React.ReactElement> => await Footer();

describe('Footer Component', () => {
  it('renders without crashing', async () => {
    render(await AsyncFooter());
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('contains copyright information', async () => {
    render(await AsyncFooter());
    expect(screen.getByText('© 2025')).toBeInTheDocument();
  });

  it('has RS School link', async () => {
    render(await AsyncFooter());
    const rsLink = screen.getByRole('link', { name: /rs school/i });
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/');
  });

  it('has GitHub link', async () => {
    render(await AsyncFooter());
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/harmon1c');
  });
});
