import { beforeEach, describe, expect, it } from "vitest";
import { defaultConsentSettings, loadConsentSettings, saveConsentSettings } from "./usePrivacyConsent";

describe("privacy consent settings", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to AI-assisted local processing without memory or email consent", () => {
    expect(loadConsentSettings()).toEqual(defaultConsentSettings);
  });

  it("persists explicit consent choices", () => {
    saveConsentSettings({
      ...defaultConsentSettings,
      privacyMode: "local_only",
      allowAiProcessing: false,
      syncScopes: ["none"],
      updatedAt: "2026-05-09T10:24:58.071Z",
    });

    expect(loadConsentSettings().allowAiProcessing).toBe(false);
    expect(loadConsentSettings().syncScopes).toEqual(["none"]);
  });
});
