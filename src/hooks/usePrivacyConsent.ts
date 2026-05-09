import { useCallback, useState } from "react";
import type { ConsentSettings } from "@/domain/advocacy";
import { browserStorage } from "@/storage/localStorageAdapter";

const STORAGE_KEY = "burgess-consent-settings";

export const defaultConsentSettings: ConsentSettings = {
  privacyMode: "local_plus_ai",
  allowAiProcessing: true,
  allowMemorySummaries: false,
  allowEmailProcessing: false,
  syncScopes: ["singleRequest"],
  updatedAt: "",
};

function migrateConsent(value: unknown): ConsentSettings {
  if (!value || typeof value !== "object") return defaultConsentSettings;
  return {
    ...defaultConsentSettings,
    ...(value as Partial<ConsentSettings>),
  };
}

export function loadConsentSettings(): ConsentSettings {
  return browserStorage.load(STORAGE_KEY, defaultConsentSettings, migrateConsent);
}

export function saveConsentSettings(settings: ConsentSettings): void {
  browserStorage.save(STORAGE_KEY, settings);
}

export function usePrivacyConsent() {
  const [settings, setSettings] = useState<ConsentSettings>(loadConsentSettings);

  const update = useCallback((patch: Partial<ConsentSettings>) => {
    setSettings((prev) => {
      const updated: ConsentSettings = {
        ...prev,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      saveConsentSettings(updated);
      return updated;
    });
  }, []);

  return { settings, update };
}
