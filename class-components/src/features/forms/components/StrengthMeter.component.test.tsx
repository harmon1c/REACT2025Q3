import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StrengthMeter } from './StrengthMeter';

vi.mock('next-intl', () => ({
  useTranslations() {
    return (key: string): string => key;
  },
}));

describe('StrengthMeter component', () => {
  it('displays strength status keys for different password scores', () => {
    const { rerender } = render(<StrengthMeter password="a" />); // only lower
    expect(screen.getByText('forms.status.strength_0')).toBeInTheDocument();
    rerender(<StrengthMeter password="aA" />); // lower+upper -> 2 buckets => score 1
    expect(screen.getByText('forms.status.strength_1')).toBeInTheDocument();
    rerender(<StrengthMeter password="aA1" />); // + digit => score 2
    expect(screen.getByText('forms.status.strength_2')).toBeInTheDocument();
    rerender(<StrengthMeter password="aA1!" />); // + special => score 3
    expect(screen.getByText('forms.status.strength_3')).toBeInTheDocument();
    rerender(<StrengthMeter password="aA1!xxxx" />); // + length => score 4
    expect(screen.getByText('forms.status.strength_4')).toBeInTheDocument();
  });
});
