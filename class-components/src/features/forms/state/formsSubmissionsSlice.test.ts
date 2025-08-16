import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RootStateShape } from '@/store/types';
import { countriesList } from '../utils/countriesList';
import reducer, {
  addUncontrolledSubmission,
  addRHFSubmission,
  setAllSubmissions,
  type FormsSubmissionsState,
} from './formsSubmissionsSlice';
import {
  selectUncontrolledSubmissions,
  selectRHFSubmissions,
  selectUncontrolledCount,
  selectRHFCount,
  selectTotalSubmissionsCount,
  selectAllSubmissions,
} from './formsSelectors';

function buildState(partial?: Partial<FormsSubmissionsState>): RootStateShape {
  return {
    formsSubmissions: {
      uncontrolled: [],
      rhf: [],
      ...partial,
    },
    countries: { list: countriesList },
    selectedItems: { items: [] },
    pokemonApi: {},
  };
}

describe('formsSubmissionsSlice reducers & selectors', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('adds uncontrolled submissions (unshift ordering) with generated id & metadata', () => {
    const first = reducer(
      undefined,
      addUncontrolledSubmission({
        name: 'Alice',
        age: 20,
        email: 'alice@example.com',
        gender: 'female',
        country: 'Canada',
      })
    );
    const second = reducer(
      first,
      addUncontrolledSubmission({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        country: 'USA',
      })
    );
    expect(second.uncontrolled).toHaveLength(2);
    expect(second.uncontrolled[0].name).toBe('Bob');
    expect(second.uncontrolled[0].formType).toBe('uncontrolled');
    expect(typeof second.uncontrolled[0].id).toBe('string');
    expect(second.uncontrolled[0].createdAt).toBeTypeOf('number');
    expect(second.uncontrolled[0].id).not.toBe(second.uncontrolled[1].id);
  });

  it('adds rhf submissions (unshift ordering) with metadata', () => {
    const st = reducer(
      undefined,
      addRHFSubmission({
        name: 'Carl',
        age: 28,
        email: 'carl@example.com',
        gender: 'male',
        country: 'Brazil',
      })
    );
    expect(st.rhf[0].formType).toBe('rhf');
    const st2 = reducer(
      st,
      addRHFSubmission({
        name: 'Dana',
        age: 22,
        email: 'dana@example.com',
        gender: 'female',
        country: 'France',
      })
    );
    expect(st2.rhf).toHaveLength(2);
    expect(st2.rhf[0].name).toBe('Dana');
  });

  it('setAllSubmissions replaces state immutably', () => {
    const base = reducer(undefined, { type: 'noop' });
    const replaced = reducer(
      base,
      setAllSubmissions({
        uncontrolled: [
          {
            id: 'u1',
            formType: 'uncontrolled',
            name: 'Eve',
            age: 18,
            email: 'eve@example.com',
            gender: 'female',
            createdAt: 1,
          },
        ],
        rhf: [],
      })
    );
    expect(replaced.uncontrolled).toHaveLength(1);
    expect(replaced.uncontrolled[0].name).toBe('Eve');
  });

  it('selectors derive counts & merged sorted list by createdAt desc', () => {
    const nowSpy = vi.spyOn(Date, 'now');
    nowSpy.mockReturnValueOnce(1000);
    let state: FormsSubmissionsState | undefined = undefined;
    state = reducer(
      state,
      addUncontrolledSubmission({
        name: 'First',
        age: 10,
        email: 'first@example.com',
        gender: 'other',
        country: 'Spain',
      })
    );
    nowSpy.mockReturnValueOnce(2000);
    state = reducer(
      state,
      addRHFSubmission({
        name: 'Second',
        age: 11,
        email: 'second@example.com',
        gender: 'male',
        country: 'Italy',
      })
    );
    nowSpy.mockReturnValueOnce(1500);
    state = reducer(
      state,
      addUncontrolledSubmission({
        name: 'Third',
        age: 12,
        email: 'third@example.com',
        gender: 'female',
        country: 'Japan',
      })
    );
    const root = buildState(state);
    expect(selectUncontrolledCount(root)).toBe(2);
    expect(selectRHFCount(root)).toBe(1);
    expect(selectTotalSubmissionsCount(root)).toBe(3);
    const merged = selectAllSubmissions(root);
    expect(merged.map((s) => s.name)).toEqual(['Second', 'Third', 'First']);
    expect(selectUncontrolledSubmissions(root)).toHaveLength(2);
    expect(selectRHFSubmissions(root)).toHaveLength(1);
  });
});
