import { useCallback, useEffect, useRef, useState } from "react";

// Source: https://usehooks.com/useLocalStorage/
export default function useLocalStorage<T>(key: string, initialValue: T) {
  const initialValueRef = useRef(initialValue);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Re-render after initial hydration
  useEffect(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);

      if (item === "undefined") {
        setStoredValue(undefined as any);
        return;
      }

      // Parse stored json or if none return initialValue
      if (item != null) {
        const storedValue = JSON.parse(item);
        if (item !== JSON.stringify(initialValueRef.current)) {
          setStoredValue(storedValue);
        }
      }
    } catch (error) {
      // We couldn't fetch/parse the stored value
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [key]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        // Save state
        setStoredValue((prevValue) => {
          // Allow value to be a function so we have same API as useState
          const valueToStore =
            value instanceof Function ? value(prevValue) : value;

          // Save to local storage
          window.localStorage.setItem(key, JSON.stringify(valueToStore));

          // And update the React state
          return valueToStore;
        });
      } catch (error) {
        // A more advanced implementation would handle the error case
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [key],
  );

  const returnValue: [T, typeof setValue] = [storedValue, setValue];

  return returnValue;
}
