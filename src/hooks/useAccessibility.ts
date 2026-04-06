import { useState, useEffect, useCallback } from "react";

export interface AccessibilitySettings {
  fontSize: "default" | "large" | "xl";
  highContrast: boolean;
  reducedMotion: boolean;
  readingMode: boolean;
  lineSpacing: "default" | "relaxed" | "loose";
  darkMode: boolean;
}

const STORAGE_KEY = "a11y-settings";

const defaults: AccessibilitySettings = {
  fontSize: "default",
  highContrast: false,
  reducedMotion: false,
  readingMode: false,
  lineSpacing: "default",
  darkMode: false,
};

function loadSettings(): AccessibilitySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaults, ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return defaults;
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }

    const root = document.documentElement;

    // Font size
    root.classList.remove("a11y-font-large", "a11y-font-xl");
    if (settings.fontSize === "large") root.classList.add("a11y-font-large");
    if (settings.fontSize === "xl") root.classList.add("a11y-font-xl");

    // High contrast
    root.classList.toggle("a11y-high-contrast", settings.highContrast);

    // Reduced motion
    root.classList.toggle("a11y-reduced-motion", settings.reducedMotion);

    // Reading mode
    root.classList.toggle("reading-mode", settings.readingMode);

    // Line spacing
    root.classList.remove("a11y-spacing-relaxed", "a11y-spacing-loose");
    if (settings.lineSpacing === "relaxed") root.classList.add("a11y-spacing-relaxed");
    if (settings.lineSpacing === "loose") root.classList.add("a11y-spacing-loose");

    // Dark mode
    root.classList.toggle("dark", settings.darkMode);
  }, [settings]);

  const update = useCallback(
    (partial: Partial<AccessibilitySettings>) =>
      setSettings((prev) => ({ ...prev, ...partial })),
    []
  );

  const reset = useCallback(() => setSettings(defaults), []);

  return { settings, update, reset };
}
