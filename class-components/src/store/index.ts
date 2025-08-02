import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../api/pokemonApiSlice';
import selectedItemsReducer from './selectedItemsSlice';

let preloadedSelectedItems = [];
const saved = window.localStorage.getItem('selectedItems');
if (saved) {
  const parsed = JSON.parse(saved);
  if (Array.isArray(parsed)) {
    preloadedSelectedItems = parsed;
  }
}

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
  preloadedState: {
    selectedItems: { items: preloadedSelectedItems },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
