import { useState, useCallback } from "react";
import type { JournalEntry } from "@/types/journal";

const STORAGE_KEY = "burgess_journal";

function loadEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(loadEntries);

  const addEntry = useCallback((entry: JournalEntry) => {
    setEntries((prev) => {
      const updated = [entry, ...prev];
      saveEntries(updated);
      return updated;
    });
  }, []);

  const updateEntry = useCallback((id: string, patch: Partial<JournalEntry>) => {
    setEntries((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...patch } : e));
      saveEntries(updated);
      return updated;
    });
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveEntries(updated);
      return updated;
    });
  }, []);

  return { entries, addEntry, updateEntry, deleteEntry };
}
