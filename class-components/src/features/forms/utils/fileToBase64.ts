/**
 * Convert a File (image) to a base64 data URL string.
 * Rejects if FileReader errors or file is empty.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (): void => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as base64 string'));
      }
    };
    reader.onerror = (): void => {
      reject(reader.error || new Error('File read error'));
    };
    reader.readAsDataURL(file);
  });
}
