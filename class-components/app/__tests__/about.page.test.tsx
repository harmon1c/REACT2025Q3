import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AboutPage from '../[locale]/about/page';

vi.mock('@/components/Main', () => ({
  Main: ({ children }: { children: React.ReactNode }): React.JSX.Element => (
    <div data-testid="main">{children}</div>
  ),
}));

vi.mock('next-intl', () => ({
  useTranslations:
    () =>
    (key: string): string => {
      const map: Record<string, string> = {
        title: 'About This Application',
        'authorInfo.title': 'Author Information',
        'authorInfo.createdBy': 'Created by',
        'authorInfo.description': 'Pokemon Explorer showcase',
        'techStack.title': 'Technology Stack',
        'features.title': 'Features',
        'features.search': 'Powerful search',
        'features.pagination': 'Pagination',
        'features.details': 'Detailed view',
        'features.selection': 'Selection & export',
        'features.themes': 'Themes',
        'features.i18n': 'Internationalization',
        'api.title': 'Public API',
        'api.description': 'Data provided by PokeAPI',
      };
      return map[key] ?? key;
    },
}));

describe('AboutPage (App Router)', () => {
  it('renders core sections', () => {
    render(<AboutPage />);
    expect(screen.getByTestId('main')).toBeInTheDocument();
    expect(screen.getByText('About This Application')).toBeInTheDocument();
    expect(screen.getByText('Author Information')).toBeInTheDocument();
    expect(screen.getByText('Technology Stack')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
  });
});
