import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getFocusable,
  trapTabKey,
} from '@/features/forms/components/focusTrap';
import { addRHFSubmission } from '@/features/forms/state/formsSubmissionsSlice';
import { addItem, type SelectedItem } from './selectedItemsSlice';
import { createAppStore } from './index';

interface MinimalStoreState {
  selectedItems: { items: unknown[] };
  formsSubmissions: { uncontrolled: unknown[]; rhf: unknown[] };
}
function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null;
}
function isStoreState(val: unknown): val is MinimalStoreState {
  return (
    typeof val === 'object' &&
    val !== null &&
    'selectedItems' in val &&
    'formsSubmissions' in val
  );
}

function seedLocalStorage(key: string, value: unknown): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

describe('store/createAppStore initialization & persistence', () => {
  beforeEach((): void => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates store with empty selectedItems when no preloaded (window defined)', () => {
    const store = createAppStore();
    const state = store.getState();
    expect(isStoreState(state)).toBe(true);
    if (!isStoreState(state)) {
      return;
    }
    expect(state.selectedItems.items).toEqual([]);
  });

  it('loads persisted submissions (sanitized) on init', () => {
    seedLocalStorage('formsSubmissions', {
      uncontrolled: [
        {
          id: 'u1',
          formType: 'uncontrolled',
          name: 'Alice',
          age: 20,
          email: 'alice@example.com',
          gender: 'female',
          createdAt: 111,
          avatarBase64: 'data:image/png;base64,abc',
        },
        {
          id: 'bad',
          formType: 'uncontrolled',
          name: 'X',
          age: 10,
          email: 'x@example.com',
          gender: 'male',
        },
      ],
      rhf: [],
    });
    const store = createAppStore();
    const state = store.getState();
    expect(isStoreState(state)).toBe(true);
    if (!isStoreState(state)) {
      return;
    }
    const list = state.formsSubmissions.uncontrolled;
    expect(list).toHaveLength(1);
  });

  it('ignores malformed persisted JSON (parse error)', () => {
    window.localStorage.setItem('formsSubmissions', '{not-json');
    const store = createAppStore();
    const state = store.getState();
    expect(isStoreState(state)).toBe(true);
    if (!isStoreState(state)) {
      return;
    }
    expect(state.formsSubmissions.uncontrolled).toHaveLength(0);
  });

  it('persists submissions only when slice changes (debounce duplicate writes)', () => {
    const store = createAppStore();
    const spy = vi.spyOn(window.localStorage, 'setItem');
    store.dispatch(
      addRHFSubmission({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        country: 'USA',
      })
    );
    const afterFirst = spy.mock.calls.length;
    expect(afterFirst).toBeGreaterThan(0);
    store.dispatch(
      addItem({ id: '1', name: 'Item 1', description: 'd', detailsUrl: '' })
    );
    const afterSecond = spy.mock.calls.length;
    expect(afterSecond - afterFirst).toBeLessThanOrEqual(1);
  });

  it('does not dispatch setAllSubmissions when persisted arrays are both empty', () => {
    window.localStorage.setItem(
      'formsSubmissions',
      JSON.stringify({ uncontrolled: [], rhf: [] })
    );
    const spy = vi.spyOn(window.localStorage, 'setItem');
    const store = createAppStore();
    expect(spy.mock.calls.length).toBe(0);
    store.dispatch(
      addRHFSubmission({
        name: 'Eve',
        age: 22,
        email: 'eve@example.com',
        gender: 'female',
        country: 'USA',
      })
    );
    expect(spy.mock.calls.length).toBeGreaterThan(0);
  });

  it('initPreloadedSelectedItems returns [] on corrupt selectedItems JSON', () => {
    window.localStorage.setItem('selectedItems', '{oops');
    const store = createAppStore();
    const state = store.getState();
    if (!isStoreState(state)) {
      return;
    }
    expect(state.selectedItems.items).toEqual([]);
  });

  it('sanitizer drops optional avatar/country when not strings', () => {
    window.localStorage.setItem(
      'formsSubmissions',
      JSON.stringify({
        uncontrolled: [
          {
            id: 'x1',
            formType: 'uncontrolled',
            name: 'NoOpt',
            age: 1,
            email: 'a@b.c',
            gender: 'x',
            createdAt: 1,
            avatarBase64: 123,
            country: 999,
          },
        ],
        rhf: [],
      })
    );
    const store = createAppStore();
    const state = store.getState();
    if (!isStoreState(state)) {
      return;
    }
    const first = state.formsSubmissions.uncontrolled[0];
    if (isRecord(first)) {
      expect(first['avatarBase64']).toBeUndefined();
      expect(first['country']).toBeUndefined();
    }
  });
});

describe('store preload', () => {
  beforeEach((): void => {
    window.localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with empty items when no saved data', () => {
    const store = createAppStore();
    const state = store.getState();
    expect(isStoreState(state)).toBe(true);
    if (!isStoreState(state)) {
      return;
    }
    expect(state.selectedItems.items).toEqual([]);
  });

  it('ignores non-array saved data', () => {
    window.localStorage.setItem('selectedItems', '"foo"');
    const store = createAppStore();
    const state = store.getState();
    expect(isStoreState(state)).toBe(true);
    if (!isStoreState(state)) {
      return;
    }
    expect(state.selectedItems.items).toEqual([]);
  });

  it('hydrates selectedItems when explicit preloadedItems provided', () => {
    const saved: SelectedItem[] = [{ id: '1', name: 'One' }];
    const store = createAppStore(saved);
    const state = store.getState();
    expect(isStoreState(state)).toBe(true);
    if (!isStoreState(state)) {
      return;
    }
    const firstItem = state.selectedItems.items[0];
    if (typeof firstItem !== 'object' || firstItem === null) {
      throw new Error('expected first item object');
    }
    const serialized = JSON.stringify(firstItem);
    expect(serialized).toContain('"id":"1"');
  });
});

describe('focusTrap utilities', () => {
  it('getFocusable filters disabled/aria-hidden', () => {
    document.body.innerHTML = `
      <div id="c">
        <button id="a">A</button>
        <button id="b" disabled>B</button>
        <button id="cbtn" aria-hidden="true">C</button>
        <a id="link" href="#"></a>
      </div>`;
    const container = document.getElementById('c');
    if (!container) {
      throw new Error('container not found');
    }
    const res = getFocusable(container);
    const ids = res.map((n) => n.id).sort();
    expect(ids).toEqual(['a', 'link']);
  });

  it('trapTabKey cycles forward from last to first', () => {
    document.body.innerHTML = `
      <div id="wrap">
        <button id="first">F</button>
        <button id="mid">M</button>
        <button id="last">L</button>
      </div>`;
    const wrap = document.getElementById('wrap');
    const last = document.getElementById('last');
    if (!wrap || !last) {
      throw new Error('wrap/last not found');
    }
    last.focus();
    const ev = new KeyboardEvent('keydown', { key: 'Tab' });
    if (!(wrap instanceof HTMLElement)) {
      throw new Error('wrap not found');
    }
    trapTabKey(ev, wrap);
    expect(document.activeElement?.id).toBe('first');
  });

  it('trapTabKey cycles backward from first to last on Shift+Tab', () => {
    document.body.innerHTML = `
      <div id="wrap2">
        <button id="first2">F</button>
        <button id="last2">L</button>
      </div>`;
    const wrap = document.getElementById('wrap2');
    const firstBtn = document.getElementById('first2');
    if (!wrap || !firstBtn) {
      throw new Error('wrap/first2 not found');
    }
    firstBtn.focus();
    const ev = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    if (!(wrap instanceof HTMLElement)) {
      throw new Error('wrap not found');
    }
    trapTabKey(ev, wrap);
    expect(document.activeElement?.id).toBe('last2');
  });
});
