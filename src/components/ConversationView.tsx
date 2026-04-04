import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserProfile, Message } from "@/types/burgess";
import StaffDisplay from "./StaffDisplay";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Maximize2, Copy, Mail, Send, Sparkles, RotateCcw, Info } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

interface ConversationViewProps {
  profile: UserProfile;
  onReset: () => void;
}

function generateOpeningMessage(profile: UserProfile): string {
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

export default function ConversationView({ profile, onReset }: ConversationViewProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(() => {
    const opening = generateOpeningMessage(profile);
    return [{
      id: crypto.randomUUID(),
      role: "staff-display",
      content: opening,
      timestamp: new Date(),
    }];
  });
  const [staffReply, setStaffReply] = useState("");
  const [aiHelper, setAiHelper] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showStaff, setShowStaff] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const callAI = async (systemContext: string, userMessage: string): Promise<string> => {
    const resp = await supabase.functions.invoke("burgess-copilot", {
      body: { systemContext, userMessage, profile, conversationLog: messages.map(m => ({ role: m.role, content: m.content })) },
    });
    if (resp.error) throw new Error(resp.error.message || "AI request failed");
    return resp.data?.response || "I'm unable to generate a response right now. Please try again.";
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
      toast.error("Failed to generate response. Please try again.");
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
      toast.error("Failed to adjust response. Please try again.");
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

      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <span className="font-serif font-semibold text-foreground">Burgess Principle</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={copyLog} title="Copy log">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={emailLog} title="Email log">
              <Mail className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onReset} title="Start over">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`space-y-1 ${msg.role === "user" ? "ml-8" : "mr-4"}`}>
              <div
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
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{msg.timestamp.toLocaleTimeString()}</span>
                {(msg.role === "staff-display" || msg.role === "assistant") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-2 text-accent"
                    onClick={() => setShowStaff(msg.content)}
                  >
                    <Maximize2 className="w-3 h-3 mr-1" /> Show to staff
                  </Button>
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

        {/* Input area */}
        <div className="border-t bg-card p-4 space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">What did the staff member say?</label>
            <div className="flex gap-2">
              <Input
                value={staffReply}
                onChange={(e) => setStaffReply(e.target.value)}
                placeholder="Type or summarise their response..."
                className="h-12 text-base"
                onKeyDown={(e) => e.key === "Enter" && handleStaffReply()}
                disabled={isLoading}
              />
              <Button onClick={handleStaffReply} disabled={isLoading || !staffReply.trim()} className="h-12 px-4">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-accent flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Helper
            </label>
            <div className="flex gap-2">
              <Input
                value={aiHelper}
                onChange={(e) => setAiHelper(e.target.value)}
                placeholder="e.g. make it firmer, more polite, suggest another approach..."
                className="h-10 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleAiHelper()}
                disabled={isLoading}
              />
              <Button variant="outline" onClick={handleAiHelper} disabled={isLoading || !aiHelper.trim()} className="h-10 px-3">
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
