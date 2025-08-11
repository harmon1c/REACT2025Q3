import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './Header';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(async () => {
    const map: Record<string, string> = {
      home: 'HomeSrv',
      about: 'AboutSrv',
      switchToRussian: 'To RU',
      switchToEnglish: 'To EN',
    };
    return (key: string): string => map[key] ?? key;
  }),
}));

interface MockHeaderClientProps {
  homeLabel: string;
  aboutLabel: string;
  switchToRussianLabel: string;
  switchToEnglishLabel: string;
}

vi.mock('./HeaderClient', () => ({
  __esModule: true,
  default: ({
    homeLabel,
    aboutLabel,
    switchToRussianLabel,
    switchToEnglishLabel,
  }: MockHeaderClientProps): React.JSX.Element => (
    <div>
      <span>{homeLabel}</span>
      <span>{aboutLabel}</span>
      <span>{switchToRussianLabel}</span>
      <span>{switchToEnglishLabel}</span>
    </div>
  ),
}));

describe('Header (server)', () => {
  it('renders translated labels via HeaderClient', async () => {
    const node = await Header({ locale: 'en' });
    render(node);
    expect(screen.getByText('HomeSrv')).toBeInTheDocument();
    expect(screen.getByText('AboutSrv')).toBeInTheDocument();
    expect(screen.getByText('To RU')).toBeInTheDocument();
  });
});
