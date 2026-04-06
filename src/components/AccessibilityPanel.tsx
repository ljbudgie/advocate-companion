import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Accessibility, RotateCcw, Type, Eye, Zap, BookOpen, AlignJustify, Moon } from "lucide-react";
import { useAccessibility } from "@/hooks/useAccessibility";

export default function AccessibilityPanel() {
  const { settings, update, reset } = useAccessibility();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Accessibility settings"
          aria-label="Open accessibility settings"
        >
          <Accessibility className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 overflow-y-auto" aria-label="Accessibility settings panel">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-accent" />
            Accessibility
          </SheetTitle>
          <SheetDescription>
            Adjust the display to suit your needs. Settings are saved automatically.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Type className="w-4 h-4" />
              Text Size
            </div>
            <div className="flex gap-2">
              {([
                { value: "default", label: "A", ariaLabel: "Default text size" },
                { value: "large", label: "A", ariaLabel: "Large text size" },
                { value: "xl", label: "A", ariaLabel: "Extra large text size" },
              ] as const).map((opt, i) => (
                <Button
                  key={opt.value}
                  variant={settings.fontSize === opt.value ? "default" : "outline"}
                  className="flex-1 h-10"
                  style={{ fontSize: `${1 + i * 0.25}rem` }}
                  onClick={() => update({ fontSize: opt.value })}
                  aria-label={opt.ariaLabel}
                  aria-pressed={settings.fontSize === opt.value}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Line Spacing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <AlignJustify className="w-4 h-4" />
              Line Spacing
            </div>
            <div className="flex gap-2">
              {([
                { value: "default", label: "Normal" },
                { value: "relaxed", label: "Relaxed" },
                { value: "loose", label: "Loose" },
              ] as const).map((opt) => (
                <Button
                  key={opt.value}
                  variant={settings.lineSpacing === opt.value ? "default" : "outline"}
                  className="flex-1 h-10 text-xs"
                  onClick={() => update({ lineSpacing: opt.value })}
                  aria-pressed={settings.lineSpacing === opt.value}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex items-center gap-2 text-sm cursor-pointer">
                <Moon className="w-4 h-4" />
                Dark Mode
              </Label>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={(v) => update({ darkMode: v })}
                aria-label="Toggle dark mode"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="flex items-center gap-2 text-sm cursor-pointer">
                <Eye className="w-4 h-4" />
                High Contrast
              </Label>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(v) => update({ highContrast: v })}
                aria-label="Toggle high contrast mode"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion" className="flex items-center gap-2 text-sm cursor-pointer">
                <Zap className="w-4 h-4" />
                Reduce Motion
              </Label>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(v) => update({ reducedMotion: v })}
                aria-label="Toggle reduced motion"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reading-mode" className="flex items-center gap-2 text-sm cursor-pointer">
                <BookOpen className="w-4 h-4" />
                Reading Mode
              </Label>
              <Switch
                id="reading-mode"
                checked={settings.readingMode}
                onCheckedChange={(v) => update({ readingMode: v })}
                aria-label="Toggle dyslexia-friendly reading mode"
              />
            </div>
          </div>

          {/* Info */}
          <div className="rounded-xl bg-muted p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Dark Mode</strong> reduces brightness — easier on eyes in low light.</p>
            <p><strong>Reading Mode</strong> increases letter spacing, line height, and removes italics — helpful for dyslexia.</p>
            <p><strong>High Contrast</strong> sharpens colours for better visibility.</p>
            <p><strong>Reduce Motion</strong> disables animations for those sensitive to movement.</p>
          </div>

          {/* Reset */}
          <Button
            variant="outline"
            className="w-full"
            onClick={reset}
            aria-label="Reset all accessibility settings to defaults"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
