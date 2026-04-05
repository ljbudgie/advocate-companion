import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "readingMode";

export function useReadingMode() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("reading-mode", enabled);
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {
      // localStorage may be unavailable
    }
  }, [enabled]);

  const toggle = useCallback(() => setEnabled((prev) => !prev), []);

  return { enabled, toggle } as const;
}
