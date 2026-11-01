import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  normalize?: (raw: unknown) => T | null,
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const fallback = () => (initialValue instanceof Function ? initialValue() : initialValue);
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return fallback();
      const parsed = JSON.parse(item) as unknown;
      return (normalize ? normalize(parsed) : (parsed as T)) ?? fallback();
    } catch {
      return fallback();
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // ignore write errors
    }
  }, [key, storedValue]);

  // Keeps two open tabs in sync, otherwise the last one to save erases the other's changes
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue) as unknown;
        const next = normalize ? normalize(parsed) : (parsed as T);
        if (next !== null) setStoredValue(next);
      } catch {
        // ignore malformed values
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, normalize]);

  return [storedValue, setStoredValue];
}
