import { useState, useCallback } from "react";
import type { JournalEntry } from "@/types/journal";
import { browserStorage } from "@/storage/localStorageAdapter";

const STORAGE_KEY = "burgess_journal";

function migrateEntries(value: unknown): JournalEntry[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => ({
    followUps: [],
    ...entry,
  })) as JournalEntry[];
}

export function loadJournalEntries(): JournalEntry[] {
  return browserStorage.load(STORAGE_KEY, [], migrateEntries);
}

export function saveJournalEntries(entries: JournalEntry[]) {
  browserStorage.save(STORAGE_KEY, entries);
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(loadJournalEntries);

  const addEntry = useCallback((entry: JournalEntry) => {
    setEntries((prev) => {
      const updated = [entry, ...prev];
      saveJournalEntries(updated);
      return updated;
    });
  }, []);

  const updateEntry = useCallback((id: string, patch: Partial<JournalEntry>) => {
    setEntries((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...patch } : e));
      saveJournalEntries(updated);
      return updated;
    });
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveJournalEntries(updated);
      return updated;
    });
  }, []);

  return { entries, addEntry, updateEntry, deleteEntry };
}
