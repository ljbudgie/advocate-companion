import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CODE_FENCE_REGEX = /```(?:json)?\n?/g;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { mode } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Memory summarization mode
    if (mode === "summarize") {
      const { conversationLog, profile } = body;

      const summarizePrompt = `You are analysing a completed advocacy conversation. Extract structured memory that will help in future conversations.

USER PROFILE:
- Name: ${profile?.fullName || "Unknown"}
- Issue/Adjustment: ${profile?.adjustment || "Not specified"}
- Country: ${profile?.country || "Not specified"}

CONVERSATION:
${(conversationLog || []).map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join("\n")}

Return a JSON object with these exact fields:
{
  "effectiveStrategies": ["list of arguments or approaches that seemed to work well"],
  "preferredTone": "brief description of the tone the user seemed to prefer (e.g. 'firm but polite', 'very direct')",
  "situationNotes": "brief summary of the situation and context",
  "staffResponses": "how the staff member responded and any patterns noticed",
  "lessonsLearned": "what to do differently or repeat next time"
}

Keep each field concise (1-2 sentences max). If a field isn't applicable, use an empty string or empty array.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: "system", content: "You are a conversation analyst. Return only valid JSON, no markdown." },
            { role: "user", content: summarizePrompt },
          ],
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("AI gateway error (summarize):", response.status, text);
        throw new Error("AI gateway error during summarization");
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content || "{}";
      // Strip markdown code fences if present
      const cleaned = raw.replace(CODE_FENCE_REGEX, "").trim();

      try {
        const summary = JSON.parse(cleaned);
        return new Response(JSON.stringify({ summary }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        console.error("Failed to parse summary JSON:", cleaned);
        return new Response(JSON.stringify({ summary: null }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Default: conversation mode
    const { systemContext, userMessage, profile, conversationLog, memoryContext, responseFormat } = body;

    const systemPrompt = `You are a calm, professional advocacy co-pilot helping people assert their right to be treated as individuals — not as a policy number.

CORE PRINCIPLE (internal guidance — do NOT quote this verbatim to staff):
The Burgess Principle asks whether someone actually looked at this person's specific situation, or just applied a blanket rule. Your job is to express this idea in plain, human language — never use legal jargon like "judicial mind" or quote the principle by name. Staff and users should instantly understand the message.

Your role is to help ANYONE facing a situation where a blanket policy is being applied without individual consideration. This includes people with disabilities, hidden disabilities, or anyone being treated unfairly by rigid rules.

USER PROFILE:
- Name: ${profile?.fullName || "Unknown"}
- Issue/Adjustment: ${profile?.adjustment || "Not specified (general advocacy)"}
- Country: ${profile?.country || "Not specified"}
- Context: ${profile?.context || "None provided"}

${memoryContext ? `\n${memoryContext}\n` : ""}
GUIDELINES:
1. Always be polite, calm, and professional — but firm when needed.
2. Frame arguments in plain English that anyone can understand. Instead of "was a judicial mind applied", say things like: "Have you actually looked at my specific situation?" or "I'm asking you to consider my individual circumstances rather than just applying a blanket rule."
3. When disability is involved, reference the relevant law naturally (e.g. "Under the Equality Act, you have a duty to make reasonable adjustments") but don't lecture — be conversational.
4. For non-disability cases, focus on fairness, duty of care, and the simple principle that everyone deserves individual consideration.
5. Generate responses the user can SHOW directly to the staff member on their phone screen. Write as if the user is speaking — first person, clear, direct.
6. Do NOT include meta-instructions like "PRESENT THIS SCREEN" or "SHOW THIS TO STAFF". Just write the message itself.
7. When appropriate, point out that applying a blanket policy without considering someone's individual circumstances may not be appropriate or lawful.
8. Never be aggressive or threatening — be assertive and informed.
9. If asked to adjust tone: "firmer" means more direct about consequences; "polite" means softer but still asserting rights.
10. Keep responses concise — they will be displayed on a phone screen. Use markdown bold for key phrases only.
11. If memory from previous conversations is available, use it to build on what worked before and avoid repeating unsuccessful approaches.
12. When structured output is requested, return only valid JSON with messageText, burgess, nextSteps, riskFlags, and citations fields.

ADDITIONAL CONTEXT: ${systemContext}

CONVERSATION SO FAR:
${(conversationLog || []).map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join("\n")}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: responseFormat === "structured"
              ? `${userMessage}

Return only JSON in this shape:
{
  "messageText": "the exact message the user can show to staff",
  "burgess": {
    "sovereignQuestionAsked": true,
    "individualConsiderationEvidence": "",
    "blanketPolicyDetected": false,
    "decisionMakerIdentified": false,
    "reasonsRequested": false,
    "alternativesConsidered": false,
    "blanketPolicyLikelihood": "low",
    "auditNotes": []
  },
  "nextSteps": [],
  "riskFlags": [],
  "citations": []
}`
              : userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Unable to generate a response.";

    if (responseFormat === "structured") {
      // If the model does not return valid structured JSON, fall back to the
      // plain response so the client can infer metadata locally.
      const cleaned = content.replace(CODE_FENCE_REGEX, "").trim();
      try {
        const structured = JSON.parse(cleaned);
        return new Response(JSON.stringify({ structured, response: structured.messageText || content }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        return new Response(JSON.stringify({ response: content }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ response: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("burgess-copilot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
