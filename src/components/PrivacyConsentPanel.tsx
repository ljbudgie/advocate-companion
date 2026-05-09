import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePrivacyConsent } from "@/hooks/usePrivacyConsent";

export default function PrivacyConsentPanel() {
  const { settings, update } = usePrivacyConsent();

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-start gap-2">
        <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Privacy controls</p>
          <p className="text-xs text-muted-foreground">
            Local records stay on this device. AI, memory summaries, email processing, and future ecosystem sync only run with your consent.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={settings.privacyMode === "local_only" ? "default" : "outline"}
          size="sm"
          className="flex-1 text-xs"
          onClick={() =>
            update({
              privacyMode: "local_only",
              allowAiProcessing: false,
              allowMemorySummaries: false,
              allowEmailProcessing: false,
              syncScopes: ["none"],
            })
          }
        >
          Local only
        </Button>
        <Button
          type="button"
          variant={settings.privacyMode === "local_plus_ai" ? "default" : "outline"}
          size="sm"
          className="flex-1 text-xs"
          onClick={() =>
            update({
              privacyMode: "local_plus_ai",
              allowAiProcessing: true,
              syncScopes: ["singleRequest"],
            })
          }
        >
          AI assisted
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="ai-processing-consent" className="text-sm">
            Allow AI processing for this conversation
          </Label>
          <Switch
            id="ai-processing-consent"
            checked={settings.allowAiProcessing}
            onCheckedChange={(allowAiProcessing) => update({ allowAiProcessing })}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="memory-summary-consent" className="text-sm">
            Save AI memory summaries when starting over
          </Label>
          <Switch
            id="memory-summary-consent"
            checked={settings.allowMemorySummaries}
            onCheckedChange={(allowMemorySummaries) => update({ allowMemorySummaries })}
          />
        </div>
      </div>
    </div>
  );
}
