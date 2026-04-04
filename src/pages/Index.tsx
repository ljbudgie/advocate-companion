import { useState } from "react";
import OnboardingScreen from "@/components/OnboardingScreen";
import ConversationView from "@/components/ConversationView";
import type { UserProfile } from "@/types/burgess";

export default function Index() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  if (!profile) {
    return <OnboardingScreen onComplete={setProfile} />;
  }

  return <ConversationView profile={profile} onReset={() => setProfile(null)} />;
}
