import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface StaffDisplayProps {
  content: string;
  onClose: () => void;
}

export default function StaffDisplay({ content, onClose }: StaffDisplayProps) {
  return (
    <div className="fixed inset-0 z-50 staff-display flex flex-col">
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-staff-foreground hover:bg-staff-foreground/10"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-staff-2xl md:text-[2.5rem] leading-relaxed text-center max-w-2xl font-serif">
          {content}
        </p>
      </div>
      <div className="p-6 text-center">
        <p className="text-sm opacity-60">Tap × to return</p>
      </div>
    </div>
  );
}
