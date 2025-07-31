import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Main } from './Main';

describe('Main Component', () => {
  it('renders children correctly', () => {
    render(
      <Main>
        <div data-testid="child">Child Content</div>
      </Main>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('has proper container structure', () => {
    const { container } = render(
      <Main>
        <div>Content</div>
      </Main>
    );

    const maxWidthContainer = container.querySelector('.max-w-\\[1440px\\]');
    expect(maxWidthContainer).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <Main>
        <div>Content</div>
      </Main>
    );

    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('w-full', 'py-8');
  });
});
