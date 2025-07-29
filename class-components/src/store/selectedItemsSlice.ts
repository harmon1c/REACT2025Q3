import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface SelectedItem {
  id: string;
  name: string;
  description?: string;
  detailsUrl?: string;
}

interface SelectedItemsState {
  items: SelectedItem[];
}

const initialState: SelectedItemsState = {
  items: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<SelectedItem>) {
      if (!state.items.find((item) => item.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearItems(state) {
      state.items = [];
    },
    setItems(state, action: PayloadAction<SelectedItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, clearItems, setItems } =
  selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
