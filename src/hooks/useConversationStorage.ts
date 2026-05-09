import { useState, useCallback } from "react";
import type { UserProfile, Message } from "@/types/burgess";
import { browserStorage } from "@/storage/localStorageAdapter";

export interface SavedConversation {
  id: string;
  profile: UserProfile;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "burgess-conversations";

type StoredMessage = Omit<Message, "timestamp"> & { timestamp: string | Date };
type StoredConversation = Omit<SavedConversation, "messages"> & { messages: StoredMessage[] };

function migrateConversations(value: unknown): SavedConversation[] {
  if (!Array.isArray(value)) return [];
  // Stored records may come from older localStorage snapshots where dates were
  // serialized to strings; missing or invalid timestamps become Invalid Date
  // objects and are still preserved for follow-up repair/export flows.
  return value.map((c: StoredConversation) => ({
    ...c,
    messages: Array.isArray(c.messages)
      ? c.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
      : [],
  }));
}

export function loadAllConversations(): SavedConversation[] {
  return browserStorage.load(STORAGE_KEY, [], migrateConversations);
}

export function saveAllConversations(conversations: SavedConversation[]) {
  browserStorage.save(STORAGE_KEY, conversations);
}

export function useConversationStorage() {
  const [conversations, setConversations] = useState<SavedConversation[]>(loadAllConversations);

  const upsert = useCallback((conv: SavedConversation) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === conv.id);
      const updated = idx >= 0 ? prev.map((c, i) => (i === idx ? conv : c)) : [conv, ...prev];
      saveAllConversations(updated);
      return updated;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveAllConversations(updated);
      return updated;
    });
  }, []);

  const refresh = useCallback(() => {
    setConversations(loadAllConversations());
  }, []);

  return { conversations, upsert, remove, refresh };
}
