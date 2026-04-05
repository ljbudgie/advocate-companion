import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Shield, ArrowLeft, Search, FileDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useJournal } from "@/hooks/useJournal";
import { downloadLogPDF } from "@/lib/generateLogPDF";
import type { JournalEntry } from "@/types/journal";
import type { SavedConversation } from "@/hooks/useConversationStorage";

/* ------------------------------------------------------------------ */
/*  Status pill configuration                                         */
/* ------------------------------------------------------------------ */

const STATUS_COLOURS: Record<JournalEntry["status"], string> = {
  agreed: "bg-green-600 text-white border-green-600",
  refused: "bg-red-600 text-white border-red-600",
  pending: "bg-amber-500 text-white border-amber-500",
  ignored: "bg-gray-400 text-white border-gray-400",
  partial: "bg-blue-500 text-white border-blue-500",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function matchesSearch(entry: JournalEntry, query: string): boolean {
  const q = query.toLowerCase();
  return (
    entry.title.toLowerCase().includes(q) ||
    entry.recipient.toLowerCase().includes(q) ||
    entry.context.toLowerCase().includes(q) ||
    entry.messageSent.toLowerCase().includes(q) ||
    entry.status.toLowerCase().includes(q) ||
    entry.dateSent.toLowerCase().includes(q) ||
    (entry.theirResponse?.toLowerCase().includes(q) ?? false)
  );
}

function entriesToConversation(entries: JournalEntry[]): SavedConversation {
  return {
    id: "journal-export",
    profile: {
      fullName: "Advocacy Journal",
      adjustment: "",
      country: "",
      context: `${entries.length} journal ${entries.length === 1 ? "entry" : "entries"}`,
    },
    messages: entries.map((entry) => ({
      id: entry.id,
      role: "user" as const,
      content: [
        `Title: ${entry.title}`,
        `To: ${entry.recipient}`,
        `Date: ${new Date(entry.dateSent).toLocaleDateString()}`,
        `Status: ${entry.status}`,
        "",
        entry.messageSent,
        entry.theirResponse ? `\nResponse: ${entry.theirResponse}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      timestamp: new Date(entry.dateSent),
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/*  Thread detail view                                                */
/* ------------------------------------------------------------------ */

function ThreadDetail({
  entry,
  onBack,
}: {
  entry: JournalEntry;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-background" id="main-content">
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
        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-foreground">
            {entry.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            To {entry.recipient} ·{" "}
            {new Date(entry.dateSent).toLocaleDateString()}
          </p>
          <Badge className={STATUS_COLOURS[entry.status]}>
            {entry.status}
          </Badge>
        </div>

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
              <div key={idx} className="border rounded-xl p-5 bg-card space-y-2">
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

        <Button variant="outline" className="w-full" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to journal
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main JournalView component                                        */
/* ------------------------------------------------------------------ */

export default function JournalView() {
  const { entries } = useJournal();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [search, setSearch] = useState("");

  /* If an id param is present, show the thread detail */
  const activeEntry = useMemo(
    () => (id ? entries.find((e) => e.id === id) : undefined),
    [entries, id],
  );

  const filtered = useMemo(
    () =>
      search.trim()
        ? entries.filter((e) => matchesSearch(e, search.trim()))
        : entries,
    [entries, search],
  );

  const handleExportPDF = () => {
    if (filtered.length === 0) return;
    downloadLogPDF(entriesToConversation(filtered));
  };

  /* ---- Thread detail ---- */
  if (id) {
    if (!activeEntry) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center" id="main-content">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Entry not found.</p>
            <Button onClick={() => navigate("/journal")}>
              Back to journal
            </Button>
          </div>
        </div>
      );
    }

    return (
      <ThreadDetail
        entry={activeEntry}
        onBack={() => navigate("/journal")}
      />
    );
  }

  /* ---- List view ---- */
  return (
    <div className="min-h-screen bg-background" id="main-content">
      <header className="border-b bg-card px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          <span className="font-serif font-semibold text-foreground">
            Journal
          </span>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-6 space-y-6">
        {/* Search + export */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search entries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={filtered.length === 0}
            className="gap-1.5 shrink-0"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </Button>
        </div>

        {/* Entry cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <ExternalLink className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">
              {entries.length === 0
                ? "No journal entries yet."
                : "No entries match your search."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((entry) => (
              <Card
                key={entry.id}
                className="hover:bg-accent/5 transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-medium">
                      {entry.title}
                    </CardTitle>
                    <Badge className={STATUS_COLOURS[entry.status]}>
                      {entry.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    To {entry.recipient} ·{" "}
                    {new Date(entry.dateSent).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {entry.messageSent.length > 120
                      ? `${entry.messageSent.slice(0, 120)}…`
                      : entry.messageSent}
                  </p>
                </CardContent>

                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/journal/${entry.id}`)}
                  >
                    View thread
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
