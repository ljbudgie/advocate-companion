import { Button } from "@/components/ui/button";
import { Shield, Plus, Trash2, MessageSquare } from "lucide-react";
import type { SavedConversation } from "@/hooks/useConversationStorage";

interface ConversationHistoryProps {
  conversations: SavedConversation[];
  onResume: (conv: SavedConversation) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function ConversationHistory({ conversations, onResume, onNew, onDelete }: ConversationHistoryProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-4 py-3 flex items-center gap-2">
        <Shield className="w-5 h-5 text-accent" />
        <span className="font-serif font-semibold text-foreground">Burgess Principle</span>
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
    </div>
  );
}
