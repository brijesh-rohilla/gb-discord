/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

export default function useLocalStorage<T>(key: string, initialValue: T): [T, (_v: T) => void] {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const item = localStorage.getItem(key);

    if (!item) {
      localStorage.setItem(key, JSON.stringify(initialValue));
    }

    setValue(item ? JSON.parse(item) : initialValue);

    function handler(e: StorageEvent) {
      if (e.key !== key) return;

      const lsi = localStorage.getItem(key);
      setValue(JSON.parse(lsi ?? ''));
    }

    // Add addEventListener to storage APIs
    window.addEventListener('storage', handler);

    return () => {
      // Remove addEventListener from storage APIs
      window.removeEventListener('storage', handler);
    };
  }, []);

  const setValueWrap = (v: T) => {
    try {
      setValue(v);

      localStorage.setItem(key, JSON.stringify(v));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', { key }));
      }
    } catch (e) { console.error(e); }
  };

  return [value, setValueWrap];
}
