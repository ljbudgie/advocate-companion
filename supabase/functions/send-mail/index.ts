import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { draftId, userId } = await req.json();

    if (!draftId || !userId) {
      return new Response(
        JSON.stringify({ error: "draftId and userId are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase environment variables are not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch the draft from email_drafts
    const { data: draft, error: draftError } = await supabase
      .from("email_drafts")
      .select("*")
      .eq("id", draftId)
      .eq("user_id", userId)
      .single();

    if (draftError || !draft) {
      console.error("Draft fetch error:", draftError);
      return new Response(
        JSON.stringify({ error: "Draft not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (draft.status === "sent") {
      return new Response(
        JSON.stringify({ error: "Draft has already been sent" }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Retrieve the user's stored Microsoft access token
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(userId);

    if (userError || !userData?.user) {
      console.error("User fetch error:", userError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const accessToken =
      userData.user.user_metadata?.ms_access_token as string | undefined;

    if (!accessToken) {
      return new Response(
        JSON.stringify({
          error: "No Microsoft access token found for this user",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Send via Microsoft Graph POST /me/sendMail
    const graphResponse = await fetch(
      "https://graph.microsoft.com/v1.0/me/sendMail",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject: draft.original_subject.startsWith("Re:")
              ? draft.original_subject
              : `Re: ${draft.original_subject}`,
            body: {
              contentType: "Text",
              content: draft.generated_response,
            },
            toRecipients: [
              {
                emailAddress: {
                  address: draft.sender_address,
                },
              },
            ],
          },
        }),
      },
    );

    if (!graphResponse.ok) {
      const text = await graphResponse.text();
      console.error("Graph sendMail error:", graphResponse.status, text);
      return new Response(
        JSON.stringify({
          error: `Microsoft Graph error ${graphResponse.status}`,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Update the draft status to sent
    const { error: updateError } = await supabase
      .from("email_drafts")
      .update({ status: "sent" })
      .eq("id", draftId);

    if (updateError) {
      console.error("Draft update error:", updateError);
      throw updateError;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-mail error:", e);
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
