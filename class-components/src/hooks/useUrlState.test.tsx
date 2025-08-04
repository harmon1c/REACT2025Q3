import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useUrlState } from './useUrlState';

const wrapper = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => <BrowserRouter>{children}</BrowserRouter>;

describe('useUrlState Hook', () => {
  beforeEach((): void => {
    window.history.replaceState({}, '', '/');
  });

  it('initializes with default page value', (): void => {
    const { result } = renderHook(() => useUrlState(), { wrapper });

    expect(result.current.currentPage).toBe(1);
    expect(typeof result.current.setPage).toBe('function');
  });

  it('reads value from URL params', () => {
    window.history.replaceState({}, '', '/?page=3');

    const { result } = renderHook(() => useUrlState(), { wrapper });

    expect(result.current.currentPage).toBe(3);
  });

  it('can update URL parameter', () => {
    const { result } = renderHook(() => useUrlState(), { wrapper });

    act(() => {
      result.current.setPage(5);
    });

    expect(result.current.currentPage).toBe(5);
    expect(window.location.search).toContain('page=5');
  });

  it('preserves other URL parameters', () => {
    window.history.replaceState({}, '', '/?other=test&page=2');

    const { result } = renderHook(() => useUrlState(), { wrapper });

    act(() => {
      result.current.setPage(4);
    });

    expect(result.current.currentPage).toBe(4);
    expect(window.location.search).toContain('other=test');
    expect(window.location.search).toContain('page=4');
  });

  it('handles pokemon selection', () => {
    const { result } = renderHook(() => useUrlState(), { wrapper });

    act(() => {
      result.current.setSelectedPokemon('pikachu');
    });

    expect(result.current.selectedPokemonName).toBe('pikachu');
  });

  it('removes parameter when setting to default value', () => {
    window.history.replaceState({}, '', '/?page=3');

    const { result } = renderHook(() => useUrlState(), { wrapper });

    act(() => {
      result.current.setPage(1);
    });

    expect(result.current.currentPage).toBe(1);
    expect(window.location.search).not.toContain('page=1');
  });
});
