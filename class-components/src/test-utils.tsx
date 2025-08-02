import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { store } from './store';

export function renderWithProviders(
  ui: React.ReactElement
): ReturnType<typeof render> {
  return render(<Provider store={store}>{ui}</Provider>);
}
