import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Call the Burgess AI to generate a response draft for an incoming email.
 * Re-uses the same Lovable AI gateway and model as the burgess-copilot function.
 */
async function generateDraft(
  senderAddress: string,
  subject: string,
  body: string,
  apiKey: string,
): Promise<string> {
  const systemPrompt = `You are a calm, professional advocacy co-pilot. A user has received an email and needs help drafting a reply that asserts their right to individual consideration under the Burgess Principle.

Draft a polite but firm reply to the email below. Write in the first person as though the user is speaking. Keep it concise and professional. Do not use legal jargon — use plain English. Reference relevant law only when appropriate (e.g. Equality Act reasonable adjustments). Use markdown bold for key phrases only.`;

  const userMessage = `From: ${senderAddress}
Subject: ${subject}

${body}

Please draft a reply to this email.`;

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
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("AI gateway error:", response.status, text);
    throw new Error(`AI gateway error ${response.status}`);
  }

  const data = await response.json();
  return (
    data.choices?.[0]?.message?.content ||
    "Unable to generate a response draft."
  );
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, body, senderAddress, userId } = await req.json();

    // Validate required fields
    if (!subject || !body || !senderAddress || !userId) {
      return new Response(
        JSON.stringify({
          error:
            "subject, body, senderAddress, and userId are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase environment variables are not configured");
    }
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Generate a response draft via the Burgess AI
    const generatedResponse = await generateDraft(
      senderAddress,
      subject,
      body,
      LOVABLE_API_KEY,
    );

    // Build a deterministic message_id from the email content so that
    // duplicate submissions from Power Automate are safely upserted.
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      encoder.encode(`${senderAddress}|${subject}|${body}`),
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    const messageId = `pa-${hashHex.slice(0, 32)}`;

    // Persist the draft
    const { error: insertError } = await supabase
      .from("email_drafts")
      .upsert(
        {
          message_id: messageId,
          user_id: userId,
          sender_address: senderAddress,
          original_subject: subject,
          original_body: body,
          generated_response: generatedResponse,
          status: "pending",
        },
        { onConflict: "message_id" },
      );

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      throw insertError;
    }

    console.log(`Draft saved for Power Automate message ${messageId}`);

    return new Response(
      JSON.stringify({ success: true, messageId }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    console.error("mail-ingest-simple error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
