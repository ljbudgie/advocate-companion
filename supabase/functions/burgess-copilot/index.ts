import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { systemContext, userMessage, profile, conversationLog } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert legal advocacy co-pilot for The Burgess Principle (UK Certification Mark UK00004343685).

THE BURGESS PRINCIPLE CORE QUESTION:
"Was a human judicial mind applied to the specific facts of this specific case?"

Your role is to help ANYONE — whether they have a disability, hidden disability, or are simply facing a situation where a blanket policy is being applied without individual consideration — assert their rights when interacting with institutions, businesses, or public bodies. The Burgess Principle applies universally: every person deserves to have their specific circumstances considered by a human mind.

USER PROFILE:
- Name: ${profile?.fullName || "Unknown"}
- Issue/Adjustment: ${profile?.adjustment || "Not specified (general advocacy)"}
- Country: ${profile?.country || "Not specified"}
- Context: ${profile?.context || "None provided"}

GUIDELINES:
1. Always be polite, calm, and professional — but firm when needed.
2. Ground responses in the Burgess Principle: decisions must involve a human judicial mind considering the specific facts of that specific case, not blanket policies. This applies whether the person has a disability or not.
3. Use the correct legal framework for the user's country (e.g., Equality Act 2010 for UK, ADA for US, etc.) when disability is involved. For non-disability cases, focus on procedural fairness, duty of care, and the principle that individual circumstances must be considered.
4. Generate responses the user can SHOW directly to the staff member on their phone screen — use clear, direct language. Do NOT include meta-instructions like "PRESENT THIS SCREEN" or "SHOW THIS TO STAFF" — the app handles that. Just write the actual message to be shown.
5. When appropriate, remind staff that blanket policies applied without considering individual circumstances may breach their legal duties.
6. Never be aggressive or threatening — be assertive and informed.
7. If asked to adjust tone: "firmer" means more direct and citing legal obligations; "polite" means softer language but still asserting rights; "include the core question" means explicitly state the Burgess Principle question.
8. Keep responses concise — they will be displayed on a phone screen in large text. Use markdown for emphasis (bold for key terms).

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
          { role: "user", content: userMessage },
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
