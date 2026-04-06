import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Plus, Trash2, MessageSquare, Brain, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { SavedConversation } from "@/hooks/useConversationStorage";
import { useAIMemory } from "@/hooks/useAIMemory";
import { toast } from "sonner";
import { downloadMemoryPDF } from "@/lib/generateMemoryPDF";

interface ConversationHistoryProps {
  conversations: SavedConversation[];
  onResume: (conv: SavedConversation) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function ConversationHistory({ conversations, onResume, onNew, onDelete }: ConversationHistoryProps) {
  const [showMemory, setShowMemory] = useState(false);
  const aiMemory = useAIMemory();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-4 py-3 flex items-center gap-2">
        <Shield className="w-5 h-5 text-accent" />
        <span className="font-serif font-semibold text-foreground">Burgess Principle</span>
        <div className="ml-auto">
          <Button variant="ghost" size="icon" title="AI Memory" aria-label="View AI memory" onClick={() => setShowMemory(true)}>
            <Brain className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-serif font-bold text-foreground">Your Conversations</h1>
          <Button onClick={onNew} size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" /> New
          </Button>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No saved conversations yet.</p>
            <Button onClick={onNew} className="mx-auto">Start your first conversation</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="border rounded-xl p-4 bg-card hover:bg-accent/5 transition-colors cursor-pointer flex items-start justify-between gap-3"
                onClick={() => onResume(conv)}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{conv.profile.fullName}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.profile.adjustment || "General — blanket policy"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conv.messages.length} messages · {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Memory Dialog */}
      <Dialog open={showMemory} onOpenChange={setShowMemory}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Memory
            </DialogTitle>
            <DialogDescription>
              Things the AI has learned from your past conversations to give better advice.
            </DialogDescription>
          </DialogHeader>

          {aiMemory.memory.entries.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No memories yet. The AI will learn from your conversations when you tap "Start over".
            </p>
          ) : (
            <div className="space-y-4">
              {aiMemory.memory.preferredTone && (
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Preferred tone</p>
                  <p className="text-sm">{aiMemory.memory.preferredTone}</p>
                </div>
              )}

              {aiMemory.memory.entries.map((entry) => (
                <div key={entry.id} className="rounded-lg border p-3 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                  {entry.effectiveStrategies.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Effective strategies</p>
                      <ul className="text-sm list-disc list-inside">
                        {entry.effectiveStrategies.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.situationNotes && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Situation</p>
                      <p className="text-sm">{entry.situationNotes}</p>
                    </div>
                  )}
                  {entry.lessonsLearned && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Lessons learned</p>
                      <p className="text-sm">{entry.lessonsLearned}</p>
                    </div>
                  )}
                </div>
              ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => downloadMemoryPDF(aiMemory.memory)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as PDF
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={() => {
                    aiMemory.clearMemory();
                    toast.success("AI memory cleared");
                    setShowMemory(false);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear all memory
                </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
