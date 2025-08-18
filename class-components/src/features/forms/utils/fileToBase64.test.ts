import { describe, it, expect } from 'vitest';
import { fileToBase64 } from './fileToBase64';

function createFile(
  contents: string,
  name = 'test.txt',
  type = 'text/plain'
): File {
  return new File([contents], name, { type });
}

describe('fileToBase64', () => {
  it('converts a simple text file to a base64 data URL', async () => {
    const file = createFile('hello world');
    const dataUrl = await fileToBase64(file);
    expect(dataUrl.startsWith('data:text/plain;base64,')).toBe(true);
    const b64 = dataUrl.split(',')[1];
    const decoded = atob(b64);
    expect(decoded).toBe('hello world');
  });

  it('rejects when FileReader onerror fires', async () => {
    const original = global.FileReader;
    class ErrorFR {
      public onload: null | (() => void) = null;
      public onerror: null | (() => void) = null;
      public result: unknown = undefined;
      public readAsDataURL(): void {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror();
          }
        }, 0);
      }
    }
    // @ts-expect-error overriding global FileReader for error scenario test
    global.FileReader = ErrorFR;
    const file = createFile('bad');
    await expect(fileToBase64(file)).rejects.toThrow();
    global.FileReader = original;
  });

  it('rejects when onload gives non-string result', async () => {
    const original = global.FileReader;
    class ArrayBufferFR {
      public onload: null | (() => void) = null;
      public onerror: null | (() => void) = null;
      public result: unknown = new ArrayBuffer(8);
      public readAsDataURL(): void {
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 0);
      }
    }
    // @ts-expect-error overriding global FileReader for non-string result scenario
    global.FileReader = ArrayBufferFR;
    const file = createFile('whatever');
    await expect(fileToBase64(file)).rejects.toThrow();
    global.FileReader = original;
  });
});
