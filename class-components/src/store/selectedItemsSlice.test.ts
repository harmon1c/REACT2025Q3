import { describe, it, expect } from 'vitest';
import selectedItemsReducer, {
  addItem,
  removeItem,
  clearItems,
  setItems,
  type SelectedItem,
} from './selectedItemsSlice';

const initialState = { items: [] };
const item1: SelectedItem = {
  id: '1',
  name: 'Bulbasaur',
  description: 'Grass',
};
const item2: SelectedItem = {
  id: '2',
  name: 'Charmander',
  description: 'Fire',
};

describe('selectedItemsSlice', () => {
  it('should return the initial state', () => {
    expect(selectedItemsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should add an item', () => {
    const state = selectedItemsReducer(initialState, addItem(item1));
    expect(state.items).toContainEqual(item1);
  });

  it('should not add duplicate items', () => {
    const state1 = selectedItemsReducer(initialState, addItem(item1));
    const state2 = selectedItemsReducer(state1, addItem(item1));
    expect(state2.items).toHaveLength(1);
  });

  it('should remove an item by id', () => {
    const state1 = selectedItemsReducer(initialState, addItem(item1));
    const state2 = selectedItemsReducer(state1, addItem(item2));
    const state3 = selectedItemsReducer(state2, removeItem(item1.id));
    expect(state3.items).toEqual([item2]);
  });

  it('should clear all items', () => {
    const state1 = selectedItemsReducer(initialState, addItem(item1));
    const state2 = selectedItemsReducer(state1, addItem(item2));
    const state3 = selectedItemsReducer(state2, clearItems());
    expect(state3.items).toEqual([]);
  });

  it('should set items', () => {
    const state = selectedItemsReducer(initialState, setItems([item2]));
    expect(state.items).toEqual([item2]);
  });
});
