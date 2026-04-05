import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Fetch a single message from Microsoft Graph by its ID.
 */
async function fetchGraphMessage(
  messageId: string,
  accessToken: string,
): Promise<{
  id: string;
  subject: string;
  body: { content: string };
  from: { emailAddress: { address: string } };
}> {
  const url = `https://graph.microsoft.com/v1.0/me/messages/${encodeURIComponent(messageId)}?$select=id,subject,body,from`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Graph API error:", res.status, text);
    throw new Error(`Graph API error ${res.status}`);
  }
  return res.json();
}

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

  // ── Microsoft Graph subscription validation ──────────────────────────
  // When a subscription is created, Graph sends a GET (or POST) with a
  // validationToken query-parameter that must be echoed back as plain text.
  const url = new URL(req.url);
  const validationToken = url.searchParams.get("validationToken");
  if (validationToken) {
    return new Response(validationToken, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // ── Process webhook notifications ────────────────────────────────────
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const MS_GRAPH_ACCESS_TOKEN = Deno.env.get("MS_GRAPH_ACCESS_TOKEN");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase environment variables are not configured");
    }
    if (!MS_GRAPH_ACCESS_TOKEN) {
      throw new Error("MS_GRAPH_ACCESS_TOKEN is not configured");
    }
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const payload = await req.json();
    const notifications: Array<{
      subscriptionId: string;
      clientState?: string;
      resource: string;
      resourceData?: { id: string; ["@odata.type"]?: string };
    }> = payload.value ?? [];

    if (notifications.length === 0) {
      return new Response(JSON.stringify({ message: "No notifications" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (const notification of notifications) {
      const messageId = notification.resourceData?.id;
      if (!messageId) {
        console.warn("Notification missing resourceData.id, skipping");
        continue;
      }

      // Fetch the full message from Graph
      const message = await fetchGraphMessage(
        messageId,
        MS_GRAPH_ACCESS_TOKEN,
      );

      const senderAddress = message.from?.emailAddress?.address ?? "unknown";
      const subject = message.subject ?? "(no subject)";
      const bodyContent = message.body?.content ?? "";

      // Generate a response draft via the Burgess AI
      const generatedResponse = await generateDraft(
        senderAddress,
        subject,
        bodyContent,
        LOVABLE_API_KEY,
      );

      // Persist the draft. Use upsert to avoid duplicate messageId errors
      // if the same notification is delivered more than once.
      const { error: insertError } = await supabase
        .from("email_drafts")
        .upsert(
          {
            message_id: message.id,
            user_id: "00000000-0000-0000-0000-000000000000", // placeholder – real user mapping added later
            sender_address: senderAddress,
            original_subject: subject,
            original_body: bodyContent,
            generated_response: generatedResponse,
            status: "pending",
          },
          { onConflict: "message_id" },
        );

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        throw insertError;
      }

      console.log(`Draft saved for message ${message.id}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 202,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("mail-ingest error:", e);
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
