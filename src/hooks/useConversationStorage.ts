import { useState, useCallback } from "react";
import type { UserProfile, Message } from "@/types/burgess";

export interface SavedConversation {
  id: string;
  profile: UserProfile;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "burgess-conversations";

function loadAll(): SavedConversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((c: SavedConversation) => ({
      ...c,
      messages: c.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }));
  } catch {
    return [];
  }
}

function saveAll(conversations: SavedConversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function useConversationStorage() {
  const [conversations, setConversations] = useState<SavedConversation[]>(loadAll);

  const save = useCallback((profile: UserProfile, messages: Message[]) => {
    setConversations((prev) => {
      const existing = prev.find((c) => c.profile.fullName === profile.fullName && c.createdAt === prev.find(p => p.profile === profile)?.createdAt);
      // Always create / update by matching active id
      const updated = [...prev];
      saveAll(updated);
      return updated;
    });
  }, []);

  const upsert = useCallback((conv: SavedConversation) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === conv.id);
      const updated = idx >= 0 ? prev.map((c, i) => (i === idx ? conv : c)) : [conv, ...prev];
      saveAll(updated);
      return updated;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveAll(updated);
      return updated;
    });
  }, []);

  const refresh = useCallback(() => {
    setConversations(loadAll());
  }, []);

  return { conversations, upsert, remove, refresh };
}
