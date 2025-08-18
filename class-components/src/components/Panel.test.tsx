import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Panel } from './Panel';

describe('Panel', () => {
  it('includes padding classes by default', () => {
    const { container } = render(<Panel>Content</Panel>);
    expect(container.firstChild).toHaveClass('p-4');
    expect(container.firstChild).toHaveClass('md:p-6');
  });

  it('omits padding when padding=false', () => {
    const { container } = render(<Panel padding={false}>NoPad</Panel>);
    expect(container.firstChild).not.toHaveClass('p-4');
  });

  it('supports custom tag via as prop', () => {
    const { container } = render(<Panel as="section">Sec</Panel>);
    expect(container.querySelector('section')).not.toBeNull();
  });
});
