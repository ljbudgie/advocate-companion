import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { UserProfile } from "@/types/burgess";
import { Shield, Info, ArrowLeft, MessageSquare, Eye, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
  onBack?: () => void;
}

const ADJUSTMENT_OPTIONS = [
  "ADHD",
  "Anxiety",
  "Autism / ASD",
  "Bipolar disorder",
  "Blind / visual impairment",
  "Chronic fatigue / ME",
  "Chronic pain",
  "Coeliac disease",
  "Crohn's disease / IBD",
  "Deaf / hearing impairment",
  "Depression",
  "Diabetes",
  "Down syndrome",
  "Dyslexia",
  "Dyspraxia",
  "Ehlers-Danlos syndrome",
  "Epilepsy",
  "Fibromyalgia",
  "Heart condition",
  "Hypermobility",
  "Learning disability",
  "Lupus",
  "Mental health condition",
  "Mobility impairment",
  "Multiple sclerosis",
  "OCD",
  "PTSD",
  "Sensory processing disorder",
  "Speech impairment",
  "Tourette syndrome",
  "Wheelchair user",
  "Unfair policy / blanket rule",
  "Other",
];

const COUNTRIES = [
  "United Kingdom", "United States", "Canada", "Australia", "Ireland",
  "New Zealand", "South Africa", "India", "Germany", "France",
  "Netherlands", "Sweden", "Norway", "Denmark", "Finland",
  "Spain", "Italy", "Japan", "South Korea", "Brazil", "Other"
];

export default function OnboardingScreen({ onComplete, onBack }: OnboardingScreenProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedAdjustments, setSelectedAdjustments] = useState<string[]>([]);
  const [customAdjustment, setCustomAdjustment] = useState("");
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    adjustment: "",
    country: "",
    context: "",
  });

  const canProceed = () => {
    if (step === 1) return profile.fullName.trim().length > 0;
    if (step === 2) return true; // adjustment is optional
    if (step === 3) return profile.country.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onComplete(profile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {step === 0 && (
          <div className="text-center space-y-8 animate-in fade-in duration-700">
            {onBack && (
              <div className="flex justify-start">
                <Button variant="ghost" size="icon" onClick={onBack}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>
            )}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-serif font-bold text-foreground">
                The Burgess Principle
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                Your companion for asserting reasonable adjustments.
              </p>
            </div>
            <div className="bg-card rounded-xl border p-6 text-left space-y-4">
              <p className="text-foreground text-base font-medium">
                Here's how it works:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">Answer a few quick questions about your situation.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">We'll generate a message you can show directly to the staff member on your phone.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Bot className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">Tell us what they say back, and the AI will suggest your next response — always calm, polite, and firm.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Your information stays on your device and is never stored.
              </p>
            </div>
            <Button onClick={handleNext} size="lg" className="w-full text-base h-14">
              Let's begin
            </Button>
            <button
              onClick={() => navigate("/about")}
              className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
            >
              <Info className="w-3.5 h-3.5" /> What is the Burgess Principle?
            </button>
          </div>
        )}

        {step >= 1 && step <= 4 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    s <= step ? "bg-accent" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <Label className="text-lg font-medium">What is your full name?</Label>
                <Input
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  className="h-14 text-base"
                  autoFocus
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Label className="text-lg font-medium">
                  What's the issue or adjustment you need? <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {SCENARIO_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setProfile({ ...profile, adjustment: chip.toLowerCase() })}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        profile.adjustment === chip.toLowerCase()
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-background text-muted-foreground border-border hover:border-accent/50"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <Input
                  value={profile.adjustment}
                  onChange={(e) => setProfile({ ...profile, adjustment: e.target.value })}
                  placeholder="e.g. hearing loss, dyslexia, anxiety, unfair treatment"
                  className="h-14 text-base"
                  autoFocus
                />
                <p className="text-sm text-muted-foreground">
                  This can be a disability, a reasonable adjustment need, or any situation where you feel a blanket policy is being applied without considering your individual circumstances.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Label className="text-lg font-medium">Which country are you in?</Label>
                <select
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  className="w-full h-14 text-base rounded-lg border bg-background px-3 text-foreground"
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <Label className="text-lg font-medium">
                  Any context about your situation? <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  value={profile.context}
                  onChange={(e) => setProfile({ ...profile, context: e.target.value })}
                  placeholder="e.g. I'm at a bank and they won't provide a sign language interpreter for my appointment..."
                  className="min-h-[120px] text-base"
                  autoFocus
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="h-14 flex-1 text-base">
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="h-14 flex-1 text-base"
              >
                {step === 4 ? "Generate opening message" : "Continue"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
