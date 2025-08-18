/* eslint-disable @next/next/no-img-element */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotFound from '../[locale]/not-found';

vi.mock('next-intl', () => ({
  useTranslations:
    () =>
    (key: string): string => {
      const map: Record<string, string> = {
        title: 'Page Not Found',
        description: "The page you're looking for doesn't exist.",
        goHome: 'Go Home',
        popularSearches: 'Popular searches',
      };
      return map[key] ?? key;
    },
}));

vi.mock('@/navigation', () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }): React.JSX.Element => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }): React.JSX.Element => {
    const { alt, ...rest } = props;
    return <img alt={alt || ''} {...rest} />;
  },
}));

describe('NotFound (App Router)', () => {
  it('renders 404 and link home', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go Home' })).toHaveAttribute(
      'href',
      '/'
    );
    const img = screen.getByAltText('404 Error Animation');
    expect(img).toBeInTheDocument();
  });
});
