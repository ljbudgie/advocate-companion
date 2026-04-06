import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a calm, respectful contract-review assistant built on the Burgess Principle.

Your job is to help ordinary people — especially those with limited energy or hidden disabilities — understand contracts clause by clause, without jargon and without rush.

How you work:
1. Break the contract into individual clauses.
2. For each clause, provide a short plain-language summary.
3. For any clause that is high-risk, unclear, or especially important, apply the Burgess binary:
   "Was a human member of the team able to personally review the specific facts and implications of this clause for my individual situation?"
   If the answer is no — or there is any doubt — flag the clause for human review.
4. At the end, provide a clear summary with:
   - A short overview of the contract in everyday language
   - A list of flagged clauses with a one-line reason each
   - Suggested next steps or polite follow-up questions the user might ask the other party

Rules:
- Never give legal advice. You are an assistive tool, not a solicitor.
- Never be aggressive, confrontational, or alarming. Be warm, steady, and honest.
- Use plain language throughout. Avoid legal jargon.
- Keep the tone calm and human-first — as if you are sitting beside a friend and reading through it together.
- Bold key phrases sparingly for scannability.
- If a clause is entirely standard and low-risk, say so briefly and move on.
- Always remind the user that flagged clauses deserve a real person's attention.`;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contractText } = await req.json();

    if (!contractText || typeof contractText !== "string" || contractText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Please provide the contract text to review." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY is not configured.");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Please review the following contract clause by clause:\n\n${contractText}`,
            },
          ],
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI gateway error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const review = data.choices?.[0]?.message?.content;

    if (!review) {
      throw new Error("No review content was returned.");
    }

    return new Response(
      JSON.stringify({ review }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
