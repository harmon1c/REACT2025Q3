import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi } from 'vitest';
import selectedItemsReducer, {
  type SelectedItem,
} from '../store/selectedItemsSlice';
import { SelectedFlyout } from './SelectedFlyout';

vi.mock('next-intl', () => ({
  useTranslations:
    () =>
    (key: string, vars?: Record<string, unknown>): string => {
      if (key === 'selection.items_selected') {
        const countVal = typeof vars?.count === 'number' ? vars.count : 0;
        return countVal === 1
          ? '1 item selected'
          : `${countVal} items selected`;
      }
      const map: Record<string, string> = {
        'selection.unselect_all': 'Unselect all',
        'selection.download': 'Download',
        'selection.exporting': 'Exporting...',
        'selection.export_failed': 'Export failed',
        'selection.export_invalid': 'Invalid selection',
        'selection.export_internal': 'Internal error',
      };
      return map[key] ?? key;
    },
}));
let exportScenario:
  | 'ok'
  | 'invalid'
  | 'nodata'
  | 'internal'
  | 'other'
  | 'pending' = 'ok';
let pendingResolve: ((v: string) => void) | null = null;
vi.mock('../actions/buildCsvAction', () => ({
  buildCsvAction: vi.fn(async () => {
    if (exportScenario === 'invalid') {
      throw new Error('INVALID_PAYLOAD');
    }
    if (exportScenario === 'nodata') {
      throw new Error('NO_DATA');
    }
    if (exportScenario === 'internal') {
      throw new Error('INTERNAL_ERROR');
    }
    if (exportScenario === 'other') {
      throw new Error('SOMETHING');
    }
    if (exportScenario === 'pending') {
      return new Promise<string>((resolve) => {
        pendingResolve = resolve;
      });
    }
    return 'id,name\n1,Bulbasaur';
  }),
}));

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
    const { buildCsvAction } = await import('../actions/buildCsvAction');
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
    await waitFor(() => expect(buildCsvAction).toHaveBeenCalled());
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();
    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    clickSpy.mockRestore();
    document.createElement = origCreate;
  });

  it('shows error messages for various failure codes', async () => {
    const { buildCsvAction } = await import('../actions/buildCsvAction');
    const scenarios: Array<{
      code: typeof exportScenario;
      expectRegex: RegExp;
    }> = [
      { code: 'invalid', expectRegex: /Invalid selection/i },
      { code: 'nodata', expectRegex: /Export failed/i },
      { code: 'internal', expectRegex: /Internal error/i },
      { code: 'other', expectRegex: /Export failed/i },
    ];

    for (const s of scenarios) {
      cleanup();
      exportScenario = s.code;
      renderWithStore([
        {
          id: '1',
          name: 'Bulbasaur',
          description: 'Grass',
          detailsUrl: undefined,
        },
      ]);
      fireEvent.click(screen.getByRole('button', { name: /download/i }));
      await waitFor(() => expect(buildCsvAction).toHaveBeenCalled());
      expect(screen.getByText(s.expectRegex)).toBeInTheDocument();
      if (
        'mockClear' in buildCsvAction &&
        typeof buildCsvAction.mockClear === 'function'
      ) {
        buildCsvAction.mockClear();
      }
    }
  });

  it('prevents duplicate export while loading', async () => {
    const { buildCsvAction } = await import('../actions/buildCsvAction');
    exportScenario = 'pending';
    renderWithStore([
      {
        id: '1',
        name: 'Bulbasaur',
        description: 'Grass',
        detailsUrl: undefined,
      },
    ]);
    const btn = screen.getByRole('button', { name: /download/i });
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(buildCsvAction).toHaveBeenCalledTimes(1);
    pendingResolve?.('id,name\n1,Bulbasaur');
    await waitFor(() => expect(buildCsvAction).toHaveBeenCalledTimes(1));
  });
});
