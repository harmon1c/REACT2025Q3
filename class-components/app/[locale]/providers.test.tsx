import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ReduxProvider } from './providers';

describe('ReduxProvider (app providers)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders children and initializes store (smoke)', () => {
    const ui = render(
      <ReduxProvider>
        <div data-testid="inside">child</div>
      </ReduxProvider>
    );
    expect(ui.getByTestId('inside').textContent).toBe('child');
  });
});
