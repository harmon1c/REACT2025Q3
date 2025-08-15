import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import formsSubmissionsReducer, {
  type FormsSubmissionsState,
} from '@/features/forms/state/formsSubmissionsSlice';
import {
  countriesReducer,
  type CountriesState,
} from '@/features/forms/state/countriesSlice';
import { pokemonApi } from '../api/pokemonApiSlice';
import selectedItemsReducer, { type SelectedItem } from './selectedItemsSlice';

function initPreloadedSelectedItems(): SelectedItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const saved = window.localStorage.getItem('selectedItems');
    if (!saved) {
      return [];
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface RootStateShape {
  selectedItems: { items: SelectedItem[] };
  formsSubmissions: FormsSubmissionsState;
  countries: CountriesState;
  [key: string]: unknown;
}

export function createAppStore(
  preloadedItems?: SelectedItem[]
): EnhancedStore<RootStateShape> {
  const items = preloadedItems ?? initPreloadedSelectedItems();
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      formsSubmissions: formsSubmissionsReducer,
      countries: countriesReducer,
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
    preloadedState: {
      selectedItems: { items },
    },
  });
}

export const store = createAppStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
