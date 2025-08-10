// Mock URL.createObjectURL and URL.revokeObjectURL for download tests
if (!('createObjectURL' in URL)) {
  // @ts-expect-error: JSDOM does not implement createObjectURL, so we mock it for download tests
  URL.createObjectURL = (): string => 'blob:url';
}
if (!('revokeObjectURL' in URL)) {
  // @ts-expect-error: JSDOM does not implement revokeObjectURL, so we mock it for download tests
  URL.revokeObjectURL = (): void => {};
}
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: (): void => {},
    removeEventListener: (): void => {},
    addListener: (): void => {},
    removeListener: (): void => {},
    dispatchEvent: (): boolean => false,
  }),
});
import { vi, beforeEach } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';

let __lsStore: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => (key in __lsStore ? __lsStore[key] : null)),
  setItem: vi.fn((key: string, value: string) => {
    __lsStore[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    if (key in __lsStore) {
      const rest: Record<string, string> = {};
      for (const k of Object.keys(__lsStore)) {
        if (k !== key) {
          rest[k] = __lsStore[k];
        }
      }
      __lsStore = rest;
    }
  }),
  clear: vi.fn(() => {
    __lsStore = {};
  }),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});

window.scrollTo = vi.fn();

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args: unknown[]): void {
  if (
    typeof args[0] === 'string' &&
    /Not implemented: navigation/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};

vi.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: Record<string, unknown>): React.ReactElement =>
      React.createElement('img', { ...props, 'data-next-image-mock': '' }),
  };
});
