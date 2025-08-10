import { describe, it, expect, beforeEach } from 'vitest';
import type { SelectedItem } from './selectedItemsSlice';
import { createAppStore } from './index';

describe('store preload', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes with empty items when no saved data', () => {
    const store = createAppStore();
    expect(store.getState().selectedItems.items).toEqual([]);
  });

  it('ignores non-array saved data', () => {
    window.localStorage.setItem('selectedItems', '"foo"');
    const store = createAppStore();
    expect(store.getState().selectedItems.items).toEqual([]);
  });

  it('hydrates selectedItems when explicit preloadedItems provided', () => {
    const saved: SelectedItem[] = [{ id: '1', name: 'One' }];
    const store = createAppStore(saved);
    expect(store.getState().selectedItems.items.map((i) => i.id)).toEqual([
      '1',
    ]);
  });
});
