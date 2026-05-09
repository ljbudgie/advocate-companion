import { beforeEach, describe, expect, it } from "vitest";
import { BrowserLocalStorageAdapter } from "./localStorageAdapter";

describe("BrowserLocalStorageAdapter", () => {
  const adapter = new BrowserLocalStorageAdapter();

  beforeEach(() => {
    localStorage.clear();
  });

  it("loads fallback when no value exists", () => {
    expect(adapter.load("missing", { ok: true })).toEqual({ ok: true });
  });

  it("saves and loads JSON values", () => {
    adapter.save("case", { title: "Quiet room request" });

    expect(adapter.load("case", null)).toEqual({ title: "Quiet room request" });
  });

  it("uses a migration function for stored values", () => {
    localStorage.setItem("legacy", JSON.stringify({ name: "Alex" }));

    expect(
      adapter.load("legacy", { displayName: "" }, (value) => ({
        displayName: typeof value === "object" && value && "name" in value ? String(value.name) : "",
      })),
    ).toEqual({ displayName: "Alex" });
  });
});
