import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Send, X, Sparkles, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { usePrivacyConsent } from "@/hooks/usePrivacyConsent";

interface EmailDraft {
  id: string;
  user_id: string;
  sender_address: string;
  original_subject: string;
  generated_response: string;
  status: string;
  created_at: string;
}

const TONE_OPTIONS = ["formal", "balanced", "firm", "gentle"] as const;
type Tone = (typeof TONE_OPTIONS)[number];

/** Strip characters that could manipulate an AI prompt. */
function sanitizeForPrompt(value: string): string {
  return value.replace(/[{}[\]`\\]/g, "").trim().slice(0, 500);
}

export default function EmailDraftReview() {
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const { settings: consent, update: updateConsent } = usePrivacyConsent();

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setDrafts([]);
        return;
      }

      const { data, error } = await supabase
        .from("email_drafts")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDrafts(data ?? []);
    } catch (err) {
      console.error("Draft fetch error:", err);
      toast.error("Unable to load drafts. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const handleToneAdjust = async (draft: EmailDraft, tone: Tone) => {
    if (!consent.allowEmailProcessing || !consent.allowAiProcessing) {
      toast.error("Email AI processing is disabled in privacy controls.");
      return;
    }
    setAdjustingId(draft.id);
    try {
      const safeSender = sanitizeForPrompt(draft.sender_address);
      const safeSubject = sanitizeForPrompt(draft.original_subject);
      const systemContext = `The user received an email from ${safeSender} with subject "${safeSubject}". Rewrite the following Burgess Principle response in a ${tone} tone. Keep it concise and suitable for an email reply.`;
      const resp = await supabase.functions.invoke("burgess-copilot", {
        body: {
          systemContext,
          userMessage: `Adjust this response to be more ${tone}: ${draft.generated_response}`,
          profile: null,
          conversationLog: [],
        },
      });
      if (resp.error) throw new Error(resp.error.message || "AI request failed");
      const newResponse = resp.data?.response;
      if (!newResponse) throw new Error("Empty AI response");

      const { error } = await supabase
        .from("email_drafts")
        .update({ generated_response: newResponse })
        .eq("id", draft.id);
      if (error) throw error;

      setDrafts((prev) =>
        prev.map((d) =>
          d.id === draft.id ? { ...d, generated_response: newResponse } : d,
        ),
      );
      toast.success(`Tone adjusted to ${tone}.`);
    } catch (err) {
      console.error("Tone adjustment error:", err);
      toast.error("Failed to adjust tone. Please try again.");
    } finally {
      setAdjustingId(null);
    }
  };

  const handleSend = async (draft: EmailDraft) => {
    if (!consent.allowEmailProcessing) {
      toast.error("Email processing is disabled in privacy controls.");
      return;
    }
    setSendingId(draft.id);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const resp = await supabase.functions.invoke("send-mail", {
        body: { draftId: draft.id, userId: user.id },
      });
      if (resp.error) throw new Error(resp.error.message || "Send failed");

      setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
      toast.success("Email sent successfully.");
    } catch (err) {
      console.error("Send error:", err);
      toast.error("Failed to send email. Check your Microsoft account connection and try again.");
    } finally {
      setSendingId(null);
    }
  };

  const handleDismiss = async (draft: EmailDraft) => {
    try {
      const { error } = await supabase
        .from("email_drafts")
        .update({ status: "dismissed" })
        .eq("id", draft.id);
      if (error) throw error;

      setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
      toast.success("Draft dismissed.");
    } catch (err) {
      console.error("Dismiss error:", err);
      toast.error("Failed to dismiss draft.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Loading drafts...
        </div>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <Mail className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">No pending email drafts.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          <span className="font-serif font-semibold text-foreground">
            Email Drafts
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchDrafts}
          title="Refresh drafts"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Email privacy controls</p>
          <p className="text-xs text-muted-foreground">
            Email drafts may include sensitive advocacy context. Enable this only if you want pending drafts processed through Supabase and the AI helper.
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={consent.allowEmailProcessing}
              onChange={(event) => updateConsent({ allowEmailProcessing: event.target.checked })}
            />
            Allow email draft processing
          </label>
        </div>
        {drafts.map((draft) => {
          const isAdjusting = adjustingId === draft.id;
          const isSending = sendingId === draft.id;
          const isBusy = isAdjusting || isSending || !consent.allowEmailProcessing;

          return (
            <div
              key={draft.id}
              className="rounded-xl border border-accent/20 bg-card overflow-hidden"
            >
              {/* Original email header */}
              <div className="border-b border-accent/20 px-4 py-3 space-y-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {draft.original_subject || "(No subject)"}
                </p>
                <p className="text-xs text-muted-foreground">
                  From: {draft.sender_address}
                </p>
              </div>

              {/* Generated Burgess response */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-2 text-sm text-accent">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Burgess Response</span>
                </div>
                <div className="bg-primary text-primary-foreground rounded-xl p-4 text-base leading-relaxed">
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-strong:text-inherit">
                    <ReactMarkdown>
                      {draft.generated_response || "No response generated."}
                    </ReactMarkdown>
                  </div>
                </div>

                {isAdjusting && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    Adjusting tone...
                  </div>
                )}
              </div>

              {/* Tone adjustment buttons */}
              <div className="px-4 pb-3">
                <label className="text-sm font-medium text-accent flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Adjust Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map((tone) => (
                    <Button
                      key={tone}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-3 capitalize"
                      disabled={isBusy}
                      onClick={() => handleToneAdjust(draft, tone)}
                    >
                      {tone}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-accent/20 px-4 py-3 flex items-center gap-2">
                <Button
                  onClick={() => handleSend(draft)}
                  disabled={isBusy}
                  className="h-10 px-4"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSending ? "Sending..." : "Send"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDismiss(draft)}
                  disabled={isBusy}
                  className="h-10 px-4 text-muted-foreground"
                >
                  <X className="w-4 h-4 mr-2" />
                  Dismiss
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
