import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import {
  pokemonApi,
  useGetPokemonListQuery,
  useGetPokemonDetailsQuery,
} from './pokemonApiSlice';

function makeStore(): ReturnType<typeof configureStore> {
  return configureStore({
    reducer: { [pokemonApi.reducerPath]: pokemonApi.reducer },
    middleware: (gDM) => gDM().concat(pokemonApi.middleware),
  });
}

function ListHookComponent(): React.JSX.Element {
  const { data, isSuccess } = useGetPokemonListQuery({ listResetCount: 3 });
  return (
    <div>
      <span data-testid="status">{isSuccess ? 'success' : 'pending'}</span>
      <span data-testid="count">{data ? String(data.count) : 'n/a'}</span>
    </div>
  );
}

function DetailsHookComponent(): React.JSX.Element {
  const { data, isSuccess } = useGetPokemonDetailsQuery('Pikachu');
  return (
    <div>
      <span data-testid="d-status">{isSuccess ? 'success' : 'pending'}</span>
      <span data-testid="d-name">{data ? data.name : 'n/a'}</span>
    </div>
  );
}

describe('pokemonApi hooks runtime (coverage)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    cleanup();
  });

  it('fetches list and triggers providesTags listResetCount branch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            count: 5,
            next: null,
            previous: null,
            results: [],
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      )
    );
    const store = makeStore();
    render(
      <Provider store={store}>
        <ListHookComponent />
      </Provider>
    );
    await waitFor(() =>
      expect(screen.getByTestId('status').textContent).toBe('success')
    );
    expect(screen.getByTestId('count').textContent).toBe('5');
  });

  it('fetches details and triggers providesTags', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 25,
            name: 'pikachu',
            height: 4,
            weight: 60,
            base_experience: 100,
            types: [],
            abilities: [],
            sprites: {
              front_default: null,
              back_default: null,
              front_shiny: null,
              back_shiny: null,
            },
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      )
    );
    const store = makeStore();
    render(
      <Provider store={store}>
        <DetailsHookComponent />
      </Provider>
    );
    await waitFor(() =>
      expect(screen.getByTestId('d-status').textContent).toBe('success')
    );
    expect(screen.getByTestId('d-name').textContent).toBe('pikachu');
  });
});
