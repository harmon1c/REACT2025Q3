import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  it('triggers server CSV export when Download is clicked', async () => {
    const blob = new Blob(['id,name'], { type: 'text/csv' });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(blob),
      status: 200,
    });
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:url');
    const revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});
    const anchor = document.createElement('a');
    const clickSpy = vi.spyOn(anchor, 'click').mockImplementation(() => {});
    const origCreate = document.createElement;
    document.createElement = (tag: string): HTMLElement => {
      if (tag === 'a') {
        return anchor;
      }
      return origCreate.call(document, tag);
    };
    renderWithStore([
      {
        id: '1',
        name: 'Bulbasaur',
        description: 'Grass',
        detailsUrl: undefined,
      },
    ]);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    await waitFor(() => expect(createObjectURLSpy).toHaveBeenCalled());
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();
    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    clickSpy.mockRestore();
    document.createElement = origCreate;
  });
});
