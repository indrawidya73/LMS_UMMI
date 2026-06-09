import { useState, useEffect, useCallback } from "react";

/**
 * Hook untuk localStorage dengan type safety
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

/**
 * Hook untuk session (login)
 */
export function useSession<T>() {
  const [session, setSessionState] = useState<T | null>(() => {
    try {
      const saved = localStorage.getItem("ummi_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setSession = useCallback((value: T | null) => {
    if (value) {
      localStorage.setItem("ummi_session", JSON.stringify(value));
    } else {
      localStorage.removeItem("ummi_session");
    }
    setSessionState(value);
  }, []);

  return [session, setSession] as const;
}