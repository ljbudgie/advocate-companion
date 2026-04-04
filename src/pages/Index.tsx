import { useState } from "react";
import OnboardingScreen from "@/components/OnboardingScreen";
import ConversationView from "@/components/ConversationView";
import ConversationHistory from "@/components/ConversationHistory";
import { useConversationStorage, type SavedConversation } from "@/hooks/useConversationStorage";
import type { UserProfile } from "@/types/burgess";

export default function Index() {
  const { conversations, upsert, remove, refresh } = useConversationStorage();
  const [activeConv, setActiveConv] = useState<SavedConversation | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleNewProfile = (profile: UserProfile) => {
    const conv: SavedConversation = {
      id: crypto.randomUUID(),
      profile,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setActiveConv(conv);
    setShowOnboarding(false);
  };

  const handleSave = (conv: SavedConversation) => {
    upsert(conv);
  };

  const handleReset = () => {
    setActiveConv(null);
    setShowOnboarding(false);
    refresh();
  };

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleNewProfile} />;
  }

  if (activeConv) {
    return (
      <ConversationView
        conversation={activeConv}
        onSave={handleSave}
        onReset={handleReset}
      />
    );
  }

  return (
    <ConversationHistory
      conversations={conversations}
      onResume={(conv) => setActiveConv(conv)}
      onNew={() => setShowOnboarding(true)}
      onDelete={remove}
    />
  );
}
