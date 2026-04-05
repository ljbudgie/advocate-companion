import { useState } from "react";
import { Shield, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useJournal } from "@/hooks/useJournal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { JournalEntry } from "@/types/journal";

/* ------------------------------------------------------------------ */
/*  Status configuration                                              */
/* ------------------------------------------------------------------ */

const STATUS_COLORS: Record<JournalEntry["status"], string> = {
  agreed: "bg-green-600 text-white border-green-600",
  refused: "bg-red-600 text-white border-red-600",
  pending: "bg-amber-500 text-white border-amber-500",
  ignored: "bg-gray-400 text-white border-gray-400",
  partial: "bg-blue-500 text-white border-blue-500",
};

const OUTCOME_OPTIONS: { label: string; value: JournalEntry["status"] }[] = [
  { label: "Ignored", value: "ignored" },
  { label: "Refused", value: "refused" },
  { label: "Partially agreed", value: "partial" },
  { label: "Agreed", value: "agreed" },
  { label: "Asked for more info", value: "pending" },
];

/* ------------------------------------------------------------------ */
/*  JournalThread component                                           */
/* ------------------------------------------------------------------ */

export default function JournalThread({
  entry,
  onBack,
}: {
  entry: JournalEntry;
  onBack: () => void;
}) {
  const { updateEntry } = useJournal();
  const [loading, setLoading] = useState(false);
  const [suggestedStep, setSuggestedStep] = useState<string | null>(null);

  /* Update status via outcome chip */
  const handleOutcome = (status: JournalEntry["status"]) => {
    updateEntry(entry.id, { status });
    toast.success(`Status updated to "${status}"`);
  };

  /* Call burgess-copilot for the next step */
  const handleGenerateNextStep = async () => {
    if (loading) return;
    setLoading(true);
    setSuggestedStep(null);

    try {
      const userMessage = [
        "Based on the following advocacy interaction, suggest my next step or escalation action.",
        "",
        `Original message I sent:\n${entry.messageSent}`,
        entry.theirResponse
          ? `Their response:\n${entry.theirResponse}`
          : "They have not responded yet.",
        `Current outcome: ${entry.status}`,
        entry.context ? `Context: ${entry.context}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      const resp = await supabase.functions.invoke("burgess-copilot", {
        body: {
          systemContext:
            "The user is reviewing a past advocacy interaction and wants a suggested next step or escalation based on the outcome so far.",
          userMessage,
          profile: null,
          conversationLog: [],
        },
      });

      if (resp.error) {
        throw new Error(resp.error.message || "AI request failed");
      }

      const content =
        resp.data?.response ||
        "Unable to generate a suggestion right now. Please try again.";

      setSuggestedStep(content);

      /* Persist as a follow-up on the entry */
      const newFollowUp = {
        date: new Date().toISOString(),
        content,
        generatedBy: "ai" as const,
      };
      updateEntry(entry.id, {
        followUps: [...entry.followUps, newFollowUp],
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" id="main-content">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          <span className="font-serif font-semibold text-foreground">
            Thread
          </span>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-6 space-y-6">
        {/* Title & meta */}
        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-foreground">
            {entry.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            To {entry.recipient} ·{" "}
            {new Date(entry.dateSent).toLocaleDateString()}
          </p>
          <Badge className={STATUS_COLORS[entry.status]}>{entry.status}</Badge>
        </div>

        {/* ---- Chronological thread ---- */}

        {/* Original message */}
        <div className="border rounded-xl p-5 bg-card space-y-2">
          <p className="text-sm font-medium text-foreground">Message sent</p>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {entry.messageSent}
          </p>
        </div>

        {/* Their response */}
        {entry.theirResponse && (
          <div className="border rounded-xl p-5 bg-card space-y-2">
            <p className="text-sm font-medium text-foreground">
              Their response
            </p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {entry.theirResponse}
            </p>
          </div>
        )}

        {/* Follow-ups */}
        {entry.followUps.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-serif font-semibold text-foreground">
              Follow-ups
            </h2>
            {entry.followUps.map((fu, idx) => (
              <div
                key={idx}
                className="border rounded-xl p-5 bg-card space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {new Date(fu.date).toLocaleDateString()}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {fu.generatedBy === "ai" ? "AI-generated" : "You"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {fu.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Suggested next step (inline after thread) */}
        {suggestedStep && (
          <div className="border rounded-xl p-5 bg-accent/10 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <p className="text-sm font-medium text-foreground">
                Suggested next step
              </p>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {suggestedStep}
            </p>
          </div>
        )}

        {/* ---- Outcome chips ---- */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            What was the outcome?
          </p>
          <div className="flex flex-wrap gap-2">
            {OUTCOME_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={entry.status === opt.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleOutcome(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Generate next step button */}
        <Button
          className="w-full gap-2"
          onClick={handleGenerateNextStep}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {loading ? "Generating…" : "Generate my next step"}
        </Button>

        {/* Back button */}
        <Button variant="outline" className="w-full" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to journal
        </Button>
      </div>
    </div>
  );
}
