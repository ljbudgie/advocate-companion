import { supabase } from "@/integrations/supabase/client";
import type { BurgessPrincipleMetadata } from "@/domain/advocacy";
import { inferBurgessMetadata } from "@/domain/advocacy";
import type { Message, UserProfile } from "@/types/burgess";
import type { AIMemoryEntry } from "@/hooks/useAIMemory";

export interface StructuredAiResponse {
  messageText: string;
  burgess: BurgessPrincipleMetadata;
  nextSteps: string[];
  riskFlags: string[];
  citations: string[];
}

interface CopilotRequest {
  systemContext: string;
  userMessage: string;
  profile: UserProfile;
  memoryContext: string;
  conversationLog: Pick<Message, "role" | "content">[];
}

interface SummaryRequest {
  profile: UserProfile;
  conversationLog: Pick<Message, "role" | "content">[];
}

function parseStructuredResponse(value: unknown): StructuredAiResponse {
  if (value && typeof value === "object") {
    const data = value as Partial<StructuredAiResponse> & { response?: string };
    const messageText = data.messageText || data.response || "";
    return {
      messageText,
      burgess: data.burgess || inferBurgessMetadata(messageText),
      nextSteps: Array.isArray(data.nextSteps) ? data.nextSteps : [],
      riskFlags: Array.isArray(data.riskFlags) ? data.riskFlags : [],
      citations: Array.isArray(data.citations) ? data.citations : [],
    };
  }

  const messageText = typeof value === "string" ? value : "I'm unable to generate a response right now. Please try again.";
  return {
    messageText,
    burgess: inferBurgessMetadata(messageText),
    nextSteps: [],
    riskFlags: [],
    citations: [],
  };
}

export async function generateAdvocacyResponse(request: CopilotRequest): Promise<StructuredAiResponse> {
  const resp = await supabase.functions.invoke("burgess-copilot", {
    body: {
      responseFormat: "structured",
      ...request,
    },
  });
  if (resp.error) throw new Error(resp.error.message || "AI request failed");
  return parseStructuredResponse(resp.data?.structured || resp.data);
}

export async function summarizeConversation(request: SummaryRequest): Promise<AIMemoryEntry | null> {
  const resp = await supabase.functions.invoke("burgess-copilot", {
    body: {
      mode: "summarize",
      profile: request.profile,
      conversationLog: request.conversationLog,
    },
  });
  if (resp.error) throw new Error(resp.error.message || "AI summary failed");
  if (!resp.data?.summary) return null;

  const summary = resp.data.summary as Partial<AIMemoryEntry>;
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    effectiveStrategies: Array.isArray(summary.effectiveStrategies) ? summary.effectiveStrategies : [],
    preferredTone: summary.preferredTone || "",
    situationNotes: summary.situationNotes || "",
    staffResponses: summary.staffResponses || "",
    lessonsLearned: summary.lessonsLearned || "",
  };
}

export const burgessCopilotInternals = {
  parseStructuredResponse,
};
