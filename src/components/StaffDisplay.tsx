import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface StaffDisplayProps {
  content: string;
  onClose: () => void;
}

export default function StaffDisplay({ content, onClose }: StaffDisplayProps) {
  const tts = useTextToSpeech();

  // Stop speaking when closing
  useEffect(() => {
    return () => {
      tts.stop();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 staff-display flex flex-col">
      <div className="flex justify-between items-center p-4">
        {tts.isSupported && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => tts.toggle(content)}
            className="text-staff-foreground hover:bg-staff-foreground/10 gap-2"
            aria-label={tts.isSpeaking ? "Stop reading" : "Read aloud"}
          >
            {tts.isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span className="text-sm">{tts.isSpeaking ? "Stop" : "Read aloud"}</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-staff-foreground hover:bg-staff-foreground/10"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="text-staff-2xl md:text-[2.5rem] leading-relaxed text-center max-w-2xl font-serif prose prose-invert prose-lg max-w-none prose-strong:text-staff-foreground prose-p:text-staff-foreground">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      <div className="p-6 text-center">
        <p className="text-sm opacity-60">Tap × to return</p>
      </div>
    </div>
  );
}
