export interface JsonStorageAdapter {
  load<T>(key: string, fallback: T, migrate?: (value: unknown) => T): T;
  save<T>(key: string, value: T): void;
  remove(key: string): void;
}

export class BrowserLocalStorageAdapter implements JsonStorageAdapter {
  load<T>(key: string, fallback: T, migrate?: (value: unknown) => T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw) as unknown;
      return migrate ? migrate(parsed) : (parsed as T);
    } catch {
      return fallback;
    }
  }

  save<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

export const browserStorage = new BrowserLocalStorageAdapter();
