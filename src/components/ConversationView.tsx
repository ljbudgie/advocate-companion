import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Message } from "@/types/burgess";
import type { SavedConversation } from "@/hooks/useConversationStorage";
import StaffDisplay from "./StaffDisplay";
import { Shield, Maximize2, Copy, Mail, Send, Sparkles, RotateCcw, Info, Download, MoreVertical, X, WifiOff, Mic, MicOff, Volume2, VolumeX, BookOpen, Brain, Trash2, FileDown } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { downloadLogPDF } from "@/lib/generateLogPDF";
import { downloadMemoryPDF } from "@/lib/generateMemoryPDF";
import { useJournal } from "@/hooks/useJournal";
import type { JournalEntry } from "@/types/journal";
import AccessibilityPanel from "./AccessibilityPanel";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { offlineTemplates } from "@/lib/offlineTemplates";
import { useAIMemory } from "@/hooks/useAIMemory";
import { saveMemory } from "@/hooks/useAIMemory";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import PrivacyConsentPanel from "./PrivacyConsentPanel";
import { usePrivacyConsent } from "@/hooks/usePrivacyConsent";
import { generateAdvocacyResponse, summarizeConversation } from "@/services/burgessCopilot";
import { inferBurgessMetadata } from "@/domain/advocacy";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ConversationViewProps {
  conversation: SavedConversation;
  onSave: (conv: SavedConversation) => void;
  onReset: () => void;
}

function generateOpeningMessage(profile: SavedConversation["profile"]): string {
  const { fullName, adjustment, country } = profile;
  let legal = "reasonable adjustments";
  if (country === "United States") legal = "reasonable accommodations under the ADA";
  else if (country === "United Kingdom") legal = "reasonable adjustments under the Equality Act 2010";
  else if (country === "Canada") legal = "duty to accommodate under Canadian human rights law";
  else if (country === "Australia") legal = "reasonable adjustments under the Disability Discrimination Act";

  if (adjustment.trim()) {
    return `Hello, my name is ${fullName}. I have ${adjustment}, and I would like to discuss ${legal} that may apply to my situation. Could I please have your name and role so we can proceed?`;
  }
  return `Hello, my name is ${fullName}. I believe a blanket policy is being applied to my situation without individual consideration. I would like to discuss ${legal} that may apply. Could I please have your name and role so we can proceed?`;
}

export default function ConversationView({ conversation, onSave, onReset }: ConversationViewProps) {
  const navigate = useNavigate();
  const { entries: journalEntries, addEntry, updateEntry } = useJournal();
  const aiMemory = useAIMemory();
  const { settings: consent } = usePrivacyConsent();
  const isOnline = useOnlineStatus();
  const profile = conversation.profile;
  const isFirstConversation = conversation.messages.length === 0;
  const [openingMessage] = useState(() =>
    isFirstConversation ? generateOpeningMessage(conversation.profile) : null
  );
  const [messages, setMessages] = useState<Message[]>(() => {
    if (conversation.messages.length > 0) return conversation.messages;
    return [{
      id: crypto.randomUUID(),
      role: "staff-display",
      content: openingMessage!,
      timestamp: new Date(),
    }];
  });
  const [staffReply, setStaffReply] = useState("");
  const [aiHelper, setAiHelper] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showStaff, setShowStaff] = useState<string | null>(
    // Auto-show the first message in staff display for new conversations
    openingMessage
  );
  const [showHints, setShowHints] = useState(isFirstConversation);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const staffSpeech = useSpeechToText({
    onResult: (transcript) => setStaffReply((prev) => (prev ? prev + " " : "") + transcript),
  });
  const aiSpeech = useSpeechToText({
    onResult: (transcript) => setAiHelper((prev) => (prev ? prev + " " : "") + transcript),
  });
  const tts = useTextToSpeech();

  // Journal integration
  const existingJournalEntry = journalEntries.find((e) => e.conversationId === conversation.id);

  const saveToJournal = useCallback(() => {
    if (messages.length === 0) return;
    const staffDisplayMessages = messages.filter((m) => m.role === "staff-display");
    const userMessages = messages.filter((m) => m.role === "user");
    const firstMessage = staffDisplayMessages[0]?.content || "";
    const staffReplies = userMessages.map((m) => m.content.replace(/^Staff said: "?|"?$/g, "")).join("\n\n");

    if (existingJournalEntry) {
      updateEntry(existingJournalEntry.id, {
        messageSent: staffDisplayMessages.map((m) => m.content).join("\n\n---\n\n"),
        theirResponse: staffReplies || undefined,
      });
      toast.success("Journal entry updated");
    } else {
      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        title: `Conversation — ${profile.adjustment || "general advocacy"}`,
        recipient: "Staff member",
        context: profile.context || profile.adjustment || "",
        messageSent: firstMessage,
        dateSent: new Date().toISOString(),
        status: "pending",
        theirResponse: staffReplies || undefined,
        conversationId: conversation.id,
        burgess: inferBurgessMetadata(messages.map((m) => m.content).join("\n")),
        followUps: staffDisplayMessages.slice(1).map((m) => ({
          date: m.timestamp instanceof Date ? m.timestamp.toISOString() : new Date(m.timestamp).toISOString(),
          content: m.content,
          generatedBy: "ai" as const,
        })),
      };
      addEntry(entry);
      toast.success("Saved to journal");
    }
  }, [messages, conversation.id, existingJournalEntry, profile, addEntry, updateEntry]);

  // Auto-save when messages change
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      onSave({
        ...conversation,
        messages,
        updatedAt: new Date().toISOString(),
      });
    }, 500);
    return () => clearTimeout(saveTimeout.current);
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  

  const callAI = async (systemContext: string, userMessage: string): Promise<string> => {
    if (!consent.allowAiProcessing) {
      throw new Error("AI processing is disabled in privacy controls");
    }
    const memoryContext = aiMemory.getContextForPrompt();
    const response = await generateAdvocacyResponse({
      systemContext,
      userMessage,
      profile,
      memoryContext,
      conversationLog: messages.map(m => ({ role: m.role, content: m.content })),
    });
    return response.messageText;
  };

  const summarizeAndSaveMemory = () => {
    if (messages.length < 2 || !consent.allowMemorySummaries) return;
    const messagesSnapshot = messages.map(m => ({ role: m.role, content: m.content }));
    const profileSnapshot = { ...profile };

    summarizeConversation({
      profile: profileSnapshot,
      conversationLog: messagesSnapshot,
    }).then((entry) => {
      if (!entry) return;
      saveMemory({
        entries: [entry, ...aiMemory.memory.entries].slice(0, 10),
        preferredTone: entry.preferredTone || aiMemory.memory.preferredTone,
        updatedAt: new Date().toISOString(),
      });
    }).catch((e) => {
      console.error("Failed to summarize conversation for memory:", e);
    });
  };

  const handleStaffReply = async () => {
    if (!staffReply.trim() || isLoading) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: `Staff said: "${staffReply}"`, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setStaffReply("");
    setIsLoading(true);

    try {
      const response = await callAI(
        "Generate a suggested response for the user to show to the staff member. Be polite but firm. Ground your response in the Burgess Principle.",
        staffReply
      );
      const aiMsg: Message = { id: crypto.randomUUID(), role: "staff-display", content: response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      toast.error(consent.allowAiProcessing ? "Failed to generate response. Please try again." : "AI processing is disabled in privacy controls.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiHelper = async () => {
    if (!aiHelper.trim() || isLoading) return;
    const instruction = aiHelper;
    setAiHelper("");
    setIsLoading(true);

    const lastStaffDisplay = [...messages].reverse().find(m => m.role === "staff-display");
    try {
      const response = await callAI(
        `The user wants you to adjust the last suggested message. Their instruction: "${instruction}". The last suggested message was: "${lastStaffDisplay?.content || ""}". Rewrite it accordingly.`,
        instruction
      );
      const aiMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      toast.error(consent.allowAiProcessing ? "Failed to adjust response. Please try again." : "AI processing is disabled in privacy controls.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyLog = () => {
    const log = messages.map(m => `[${m.timestamp.toLocaleTimeString()}] ${m.role === "staff-display" ? "Show to staff" : m.role === "user" ? "Staff reply" : "AI adjustment"}: ${m.content}`).join("\n\n");
    navigator.clipboard.writeText(log);
    toast.success("Log copied to clipboard");
  };

  const emailLog = () => {
    const log = messages.map(m => `[${m.timestamp.toLocaleTimeString()}] ${m.role === "staff-display" ? "Show to staff" : m.role === "user" ? "Staff reply" : "AI adjustment"}: ${m.content}`).join("\n\n");
    const subject = encodeURIComponent(`Burgess Principle - Conversation Log - ${new Date().toLocaleDateString()}`);
    const body = encodeURIComponent(`Dear Sir/Madam,\n\nPlease find below the conversation log regarding reasonable adjustments for ${profile.fullName}.\n\n---\n\n${log}\n\n---\n\nThis log was generated by The Burgess Principle companion tool.\nUK Certification Mark UK00004343685`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <>
      {showStaff && <StaffDisplay content={showStaff} onClose={() => setShowStaff(null)} />}

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start over?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start a new conversation? Your current conversation will still be saved in your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { saveToJournal(); summarizeAndSaveMemory(); onReset(); }}>Start over</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <span className="font-serif font-semibold text-foreground">Burgess Principle</span>
          </div>
          <div className="flex gap-1">
            <AccessibilityPanel />
            <Button variant="ghost" size="icon" onClick={() => navigate("/about")} title="About">
              <Info className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="More options">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={copyLog}>
                  <Copy className="w-4 h-4 mr-2" /> Copy log
                </DropdownMenuItem>
                <DropdownMenuItem onClick={emailLog}>
                  <Mail className="w-4 h-4 mr-2" /> Email log
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadLogPDF({ ...conversation, messages })}>
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={saveToJournal}>
                  <BookOpen className="w-4 h-4 mr-2" /> {existingJournalEntry ? "Update journal" : "Save to journal"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {tts.isSupported && tts.voices.length > 1 && (
                  <div className="px-2 py-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Read-aloud voice</label>
                    <Select value={tts.selectedVoice} onValueChange={tts.setSelectedVoice}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Choose voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {tts.voices.map((v) => (
                          <SelectItem key={v.id} value={v.id} className="text-xs">
                            {v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowMemory(true)}>
                  <Brain className="w-4 h-4 mr-2" /> AI Memory
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowResetConfirm(true)} className="text-destructive focus:text-destructive">
                  <RotateCcw className="w-4 h-4 mr-2" /> Start over
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {showHints && (
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start justify-between gap-3 animate-in fade-in duration-500">
              <div className="space-y-1 text-sm text-foreground">
                <p className="font-medium">👋 Welcome to your first conversation!</p>
                <p className="text-muted-foreground">Below is a message generated for you. Tap <strong>"Show to staff"</strong> to display it full-screen on your phone so the staff member can read it.</p>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0 -mt-1 -mr-1" onClick={() => setShowHints(false)} aria-label="Dismiss hints">
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          {showHints && <PrivacyConsentPanel />}
          {messages.map((msg) => (
            <div key={msg.id} className={`space-y-1 ${msg.role === "user" ? "ml-8" : "mr-4"}`}>
              <div
                data-message-bubble
                className={`rounded-xl p-4 text-base leading-relaxed ${
                  msg.role === "staff-display"
                    ? "bg-primary text-primary-foreground"
                    : msg.role === "assistant"
                    ? "bg-accent/10 border border-accent/20 text-foreground"
                    : "bg-muted text-foreground ml-auto"
                }`}
              >
                {msg.role === "staff-display" && (
                  <div className="flex items-center gap-2 mb-2 text-sm opacity-80">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Show to staff</span>
                  </div>
                )}
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-accent">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI adjustment</span>
                  </div>
                )}
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-strong:text-inherit"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                {msg.role === "staff-display" && inferBurgessMetadata(msg.content).blanketPolicyDetected && (
                  <div className="mt-3 rounded-lg bg-background/15 p-2 text-xs">
                    Burgess check: this message asks for individual consideration rather than a blanket policy.
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{msg.timestamp.toLocaleTimeString()}</span>
                {(msg.role === "staff-display" || msg.role === "assistant") && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 text-accent"
                      onClick={() => setShowStaff(msg.content)}
                    >
                      <Maximize2 className="w-3 h-3 mr-1" /> Show to staff
                    </Button>
                    {tts.isSupported && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 px-2 text-accent"
                        onClick={() => tts.toggle(msg.content)}
                        aria-label={tts.isSpeaking ? "Stop reading" : "Read aloud"}
                      >
                        {tts.isSpeaking ? <VolumeX className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                        {tts.isSpeaking ? "Stop" : "Read aloud"}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Thinking...
            </div>
          )}
        </div>

        {/* Screen reader live region for new messages */}
        <div aria-live="polite" aria-atomic="false" className="sr-only">
          {messages.length > 0 && (() => {
            const last = messages[messages.length - 1];
            if (last.role === "staff-display") return `New suggested message: ${last.content}`;
            if (last.role === "assistant") return `AI adjustment: ${last.content}`;
            return null;
          })()}
          {isLoading && "Generating response..."}
        </div>

        <div className="border-t bg-card p-4 space-y-3">
          {!isOnline ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <WifiOff className="w-4 h-4" />
                <span>You're offline. Choose a template to get started:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {offlineTemplates.map((tpl) => (
                  <button
                    key={tpl.title}
                    className="text-left border rounded-xl p-3 hover:bg-accent/10 transition-colors space-y-1"
                    onClick={() => setStaffReply(tpl.body)}
                  >
                    <p className="font-medium text-sm text-foreground">{tpl.title}</p>
                    <p className="text-xs text-muted-foreground">{tpl.context}</p>
                  </button>
                ))}
              </div>
              {staffReply && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Edit &amp; copy your message</label>
                  <textarea
                    className="w-full min-h-[200px] rounded-xl border bg-background p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent"
                    value={staffReply}
                    onChange={(e) => setStaffReply(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(staffReply);
                      toast.success("Copied to clipboard");
                    }}
                    className="h-10 px-4"
                  >
                    <Copy className="w-4 h-4 mr-2" /> Copy message
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">What did the staff member say?</label>
                <div className="flex gap-2">
                  <Input
                    value={staffReply}
                    onChange={(e) => setStaffReply(e.target.value)}
                    placeholder={staffSpeech.isListening ? "Listening..." : "Type or summarise their response..."}
                    className="h-12 text-base"
                    onKeyDown={(e) => e.key === "Enter" && handleStaffReply()}
                    disabled={isLoading}
                  />
                  {staffSpeech.isSupported && (
                    <Button
                      variant={staffSpeech.isListening ? "default" : "outline"}
                      onClick={staffSpeech.toggle}
                      className={`h-12 px-3 ${staffSpeech.isListening ? "animate-pulse" : ""}`}
                      aria-label={staffSpeech.isListening ? "Stop listening" : "Speak"}
                      disabled={isLoading}
                    >
                      {staffSpeech.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  )}
                  <Button onClick={handleStaffReply} disabled={isLoading || !staffReply.trim() || !consent.allowAiProcessing} className="h-12 px-4" aria-label="Send message">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {!consent.allowAiProcessing && (
                  <p className="text-xs text-muted-foreground">
                    AI processing is off. Turn it on in privacy controls or use offline templates.
                  </p>
                )}
                {showHints && (
                  <p className="text-xs text-muted-foreground">After you show the message, type what the staff member said back to you here.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-accent flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Helper
                </label>
                <div className="flex gap-2">
                  <Input
                    value={aiHelper}
                    onChange={(e) => setAiHelper(e.target.value)}
                    placeholder={aiSpeech.isListening ? "Listening..." : "e.g. make it firmer, more polite, suggest another approach..."}
                    className="h-10 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleAiHelper()}
                    disabled={isLoading}
                  />
                  {aiSpeech.isSupported && (
                    <Button
                      variant={aiSpeech.isListening ? "default" : "outline"}
                      onClick={aiSpeech.toggle}
                      className={`h-10 px-3 ${aiSpeech.isListening ? "animate-pulse" : ""}`}
                      aria-label={aiSpeech.isListening ? "Stop listening" : "Speak"}
                      disabled={isLoading}
                    >
                      {aiSpeech.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleAiHelper} disabled={isLoading || !aiHelper.trim() || !consent.allowAiProcessing} className="h-10 px-3" aria-label="Send message">
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
                {showHints && (
                  <p className="text-xs text-muted-foreground">Use this to adjust the tone — e.g. "make it firmer" or "be more polite".</p>
                )}
              </div>
            </>
          )}
        </div>
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
                <div key={entry.id} className="rounded-lg border p-3 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        aiMemory.removeEntry(entry.id);
                        toast.success("Entry removed");
                      }}
                      title="Remove this entry"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
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
                <FileDown className="w-4 h-4 mr-2" />
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
                Clear resolved sessions
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
