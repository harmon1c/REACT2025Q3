import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePageSkeleton from './HomePageSkeleton';

describe('HomePageSkeleton', () => {
  it('renders 8 placeholder cards', () => {
    render(<HomePageSkeleton />);
    const placeholders = document.querySelectorAll('.p-4.rounded-xl');
    expect(placeholders.length).toBe(8);
  });

  it('contains animated blocks', () => {
    render(<HomePageSkeleton />);
    const animatedBlocks = document.querySelectorAll('.animate-pulse');
    expect(animatedBlocks.length).toBeGreaterThan(8);
  });
});
