import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

interface MockStorage {
  getItem: Mock;
  setItem: Mock;
  removeItem: Mock;
  clear: Mock;
}

let mockLocalStorage: MockStorage;

describe('useLocalStorage', () => {
  beforeEach(() => {
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      configurable: true,
    });
  });

  it('should return initial value when localStorage is empty', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );
    expect(result.current[0]).toBe('initial-value');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
  });

  it('should save value to localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify('new-value')
    );
  });

  it('should restore value from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify('stored-value'));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    expect(result.current[0]).toBe('stored-value');
  });

  it('should handle removeValue function', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    act(() => {
      result.current[2]();
    });

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
    expect(result.current[0]).toBe('initial-value');
  });

  it('should handle legacy string fallback', () => {
    mockLocalStorage.getItem.mockReturnValue('plain-string');
    const { result } = renderHook(() => useLocalStorage('test-key', 'init'));
    expect(result.current[0]).toBe('plain-string');
  });

  it('should not crash if localStorage.getItem throws', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('fail');
    });
    const { result } = renderHook(() => useLocalStorage('test-key', 'init'));
    expect(result.current[0]).toBe('init');
    mockLocalStorage.getItem.mockReset();
  });

  it('should not crash if localStorage.setItem throws', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('fail');
    });
    const { result } = renderHook(() => useLocalStorage('test-key', 'init'));
    act(() => {
      result.current[1]('new');
    });
    expect(result.current[0]).toBe('new');
    mockLocalStorage.setItem.mockReset();
  });

  it('should not crash if localStorage.removeItem throws', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.removeItem.mockImplementation(() => {
      throw new Error('fail');
    });
    const { result } = renderHook(() => useLocalStorage('test-key', 'init'));
    act(() => {
      result.current[2]();
    });
    expect(result.current[0]).toBe('init');
    mockLocalStorage.removeItem.mockReset();
  });

  it('should update value on storage event', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify('init'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'init'));
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'test-key',
          newValue: JSON.stringify('other'),
        })
      );
    });
    expect(result.current[0]).toBe('other');
  });

  it('should support setValue with function', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage('test-key', 1));
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    expect(result.current[0]).toBe(2);
  });
});
