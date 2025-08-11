import { useState, useEffect, useCallback } from 'react';

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function useLocalStorage(
  key: string,
  initialValue: string
): [
  string,
  (value: string | ((prevValue: string) => string)) => void,
  VoidFunction,
];

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void, VoidFunction];

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void, VoidFunction] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }

      try {
        return JSON.parse(item);
      } catch {
        // Handle legacy string storage for backward compatibility
        if (isString(initialValue) && isString(item)) {
          // Safe: when initialValue is string, T is string, so item (string) fits T
          /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */
          return item as T;
        }
        console.warn(
          `Invalid JSON in localStorage for key "${key}", using initial value`
        );
        return initialValue;
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (
          valueToStore === undefined ||
          valueToStore === null ||
          valueToStore === ''
        ) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // Handle legacy string storage for backward compatibility
          if (isString(initialValue) && isString(e.newValue)) {
            /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */
            setStoredValue(e.newValue as T);
          } else {
            console.warn(
              `Error parsing localStorage value for key "${key}", ignoring change`
            );
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const cleanup: VoidFunction = () =>
      window.removeEventListener('storage', handleStorageChange);

    return cleanup;
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
