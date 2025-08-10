/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OptimizedImage } from './OptimizedImage';

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({
    alt,
    src,
    className,
  }: {
    alt: string;
    src: string;
    className?: string;
  }): React.JSX.Element => (
    <img alt={alt} src={src} data-testid="opt-img" className={className} />
  ),
}));

describe('OptimizedImage', () => {
  it('renders img with given src and alt', () => {
    render(
      <OptimizedImage
        src="/img/pokemon.png"
        alt="Pika"
        width={120}
        height={120}
      />
    );
    const img = screen.getByTestId('opt-img');
    expect(img).toHaveAttribute('src', '/img/pokemon.png');
    expect(img).toHaveAttribute('alt', 'Pika');
  });

  it('applies passed className', () => {
    render(
      <OptimizedImage
        src="/a.png"
        alt="A"
        width={10}
        height={10}
        className="rounded"
      />
    );
    expect(screen.getByTestId('opt-img')).toHaveClass('rounded');
  });
});
