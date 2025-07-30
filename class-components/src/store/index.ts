import { configureStore } from '@reduxjs/toolkit';
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
  },
  preloadedState: {
    selectedItems: { items: preloadedSelectedItems },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
