import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useHasMounted } from './useHasMounted';

describe('useHasMounted', () => {
  it('returns true after mount', () => {
    const { result } = renderHook(() => useHasMounted());
    expect(result.current).toBe(true);
  });
});
