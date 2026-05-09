import { useState, useCallback } from "react";
import { browserStorage } from "@/storage/localStorageAdapter";

export interface AIMemoryEntry {
  id: string;
  date: string;
  effectiveStrategies: string[];
  preferredTone: string;
  situationNotes: string;
  staffResponses: string;
  lessonsLearned: string;
}

export interface AIMemory {
  entries: AIMemoryEntry[];
  preferredTone: string;
  updatedAt: string;
}

const STORAGE_KEY = "burgess-ai-memory";
const emptyMemory: AIMemory = { entries: [], preferredTone: "", updatedAt: "" };

function migrateMemory(value: unknown): AIMemory {
  if (!value || typeof value !== "object") return emptyMemory;
  const memory = value as Partial<AIMemory>;
  return {
    entries: Array.isArray(memory.entries) ? memory.entries : [],
    preferredTone: memory.preferredTone || "",
    updatedAt: memory.updatedAt || "",
  };
}

export function loadMemory(): AIMemory {
  return browserStorage.load(STORAGE_KEY, emptyMemory, migrateMemory);
}

function saveMemory(memory: AIMemory) {
  browserStorage.save(STORAGE_KEY, memory);
}

export function useAIMemory() {
  const [memory, setMemory] = useState<AIMemory>(loadMemory);

  const addEntry = useCallback((entry: AIMemoryEntry) => {
    setMemory((prev) => {
      // Keep last 10 entries to avoid bloating the prompt
      const entries = [entry, ...prev.entries].slice(0, 10);
      const updated: AIMemory = {
        entries,
        preferredTone: entry.preferredTone || prev.preferredTone,
        updatedAt: new Date().toISOString(),
      };
      saveMemory(updated);
      return updated;
    });
  }, []);

  const removeEntry = useCallback((entryId: string) => {
    setMemory((prev) => {
      const updated: AIMemory = {
        ...prev,
        entries: prev.entries.filter((e) => e.id !== entryId),
        updatedAt: new Date().toISOString(),
      };
      saveMemory(updated);
      return updated;
    });
  }, []);

  const clearMemory = useCallback(() => {
    // Preserve preferredTone — only clear situation entries
    setMemory((prev) => {
      const updated: AIMemory = { entries: [], preferredTone: prev.preferredTone, updatedAt: prev.updatedAt };
      saveMemory(updated);
      return updated;
    });
  }, []);

  const persistMemory = useCallback((updated: AIMemory) => {
    saveMemory(updated);
  }, []);

  const getContextForPrompt = useCallback((): string => {
    if (memory.entries.length === 0) return "";

    const lines: string[] = [
      "MEMORY FROM PREVIOUS CONVERSATIONS (use to personalise responses):",
    ];

    if (memory.preferredTone) {
      lines.push(`- User's preferred tone: ${memory.preferredTone}`);
    }

    for (const entry of memory.entries.slice(0, 5)) {
      lines.push(`\n[${new Date(entry.date).toLocaleDateString()}]`);
      if (entry.effectiveStrategies.length > 0) {
        lines.push(`  Effective strategies: ${entry.effectiveStrategies.join("; ")}`);
      }
      if (entry.situationNotes) {
        lines.push(`  Situation: ${entry.situationNotes}`);
      }
      if (entry.staffResponses) {
        lines.push(`  Staff responses: ${entry.staffResponses}`);
      }
      if (entry.lessonsLearned) {
        lines.push(`  Lessons: ${entry.lessonsLearned}`);
      }
    }

    return lines.join("\n");
  }, [memory]);

  return { memory, addEntry, removeEntry, clearMemory, persistMemory, getContextForPrompt };
}
