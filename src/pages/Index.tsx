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

  if (showOnboarding || (!activeConv && conversations.length === 0)) {
    return <div id="main-content"><OnboardingScreen onComplete={handleNewProfile} onBack={conversations.length > 0 ? () => setShowOnboarding(false) : undefined} /></div>;
  }

  if (activeConv) {
    return (
      <div id="main-content">
        <ConversationView
          conversation={activeConv}
          onSave={handleSave}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div id="main-content">
      <ConversationHistory
        conversations={conversations}
        onResume={(conv) => setActiveConv(conv)}
        onNew={() => setShowOnboarding(true)}
        onDelete={remove}
      />
    </div>
  );
}
