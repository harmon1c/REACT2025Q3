import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi } from 'vitest';
import selectedItemsReducer, {
  type SelectedItem,
} from '../store/selectedItemsSlice';
import { SelectedFlyout } from './SelectedFlyout';

describe('SelectedFlyout', () => {
  const renderWithStore = (
    items: SelectedItem[] = []
  ): ReturnType<typeof render> => {
    const store = configureStore({
      reducer: { selectedItems: selectedItemsReducer },
      preloadedState: { selectedItems: { items } },
    });
    return render(
      <Provider store={store}>
        <SelectedFlyout />
      </Provider>
    );
  };

  it('renders nothing when there are no selected items', () => {
    const { container } = renderWithStore([]);
    expect(container.firstChild).toBeNull();
  });

  it('renders flyout when there are selected items', () => {
    renderWithStore([
      {
        id: '1',
        name: 'Bulbasaur',
        description: 'Grass',
        detailsUrl: undefined,
      },
    ]);
    expect(screen.getByText(/1 item selected/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /unselect all/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download/i })
    ).toBeInTheDocument();
  });

  it('dispatches clearItems when Unselect all is clicked', () => {
    const store = configureStore({
      reducer: { selectedItems: selectedItemsReducer },
      preloadedState: {
        selectedItems: {
          items: [
            {
              id: '1',
              name: 'Bulbasaur',
              description: 'Grass',
              detailsUrl: undefined,
            },
          ],
        },
      },
    });
    render(
      <Provider store={store}>
        <SelectedFlyout />
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /unselect all/i }));
    expect(store.getState().selectedItems.items).toHaveLength(0);
  });

  it('triggers CSV download when Download CSV is clicked', () => {
    renderWithStore([
      {
        id: '1',
        name: 'Bulbasaur',
        description: 'Grass',
        detailsUrl: undefined,
      },
    ]);
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:url');
    const revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});
    const clickSpy = vi
      .spyOn(document.createElement('a'), 'click')
      .mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });
});
