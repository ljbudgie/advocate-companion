export type SyncScope =
  | "none"
  | "singleRequest"
  | "journalSummary"
  | "memorySummary"
  | "fullCaseFile";

export type PrivacyMode = "local_only" | "local_plus_ai" | "selective_sync";

export interface ConsentSettings {
  privacyMode: PrivacyMode;
  allowAiProcessing: boolean;
  allowMemorySummaries: boolean;
  allowEmailProcessing: boolean;
  syncScopes: SyncScope[];
  updatedAt: string;
}

export interface BurgessPrincipleMetadata {
  sovereignQuestionAsked: boolean;
  individualConsiderationEvidence?: string;
  blanketPolicyDetected: boolean;
  decisionMakerIdentified?: boolean;
  reasonsRequested?: boolean;
  alternativesConsidered?: boolean;
  blanketPolicyLikelihood: "low" | "medium" | "high";
  auditNotes?: string[];
}

export type AdjustmentSetting =
  | "work"
  | "education"
  | "healthcare"
  | "public_service"
  | "commercial_service"
  | "transport"
  | "housing"
  | "government"
  | "other";

export interface SensoryAccessProfile {
  profileId: string;
  communicationModes: Array<"speech" | "text" | "captioning" | "sign" | "haptic" | "visual" | "other">;
  customCommunicationModes?: Array<{
    mode: string;
    description: string;
    experimental: boolean;
  }>;
  auditoryNeeds?: string[];
  hapticProfiles?: Array<{
    id: string;
    label: string;
    purpose: "alerting" | "navigation" | "speech_substitution" | "environmental_awareness" | "other";
    customPurpose?: string;
    userControlled: boolean;
  }>;
  sensoryTriggers?: string[];
  preferredAdjustments: string[];
  medicalDeviceContext?: {
    deviceType: string;
    clinicianOrProvider?: string;
    accessRequestCategory?: "communication" | "environment" | "appointment_format" | "device_review" | "documentation" | "other";
    requestedChange?: string;
  };
}

export interface MirrorDecisionContext {
  jurisdiction: string;
  institutionType: AdjustmentSetting;
  applicableRights?: string[];
  suggestedQuestions?: string[];
  escalationRoutes?: string[];
  caveats?: string[];
}

export interface UnifiedUserContext {
  userId?: string;
  displayName?: string;
  jurisdiction: string;
  accessibilityNeeds: string[];
  communicationPreferences: string[];
  sensoryProfileId?: string;
  privacyMode: PrivacyMode;
  exportPolicy: "disabled" | "manual_case_file";
  consentScopes: SyncScope[];
}

export interface AdjustmentRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  stage: "draft" | "sent" | "awaiting_response" | "escalated" | "closed";
  outcome?: "agreed" | "partial" | "refused" | "ignored";
  setting: AdjustmentSetting;
  requestedAdjustments: string[];
  reasonSummary: string;
  institution?: {
    name?: string;
    contact?: string;
    role?: string;
  };
  mirror?: MirrorDecisionContext;
  openHear?: SensoryAccessProfile;
  burgess: BurgessPrincipleMetadata;
  conversationId?: string;
  journalEntryId?: string;
}

export interface CaseFile {
  id: string;
  title: string;
  userContext: UnifiedUserContext;
  requests: AdjustmentRequest[];
  createdAt: string;
  updatedAt: string;
}

export const defaultBurgessMetadata: BurgessPrincipleMetadata = {
  sovereignQuestionAsked: false,
  blanketPolicyDetected: false,
  decisionMakerIdentified: false,
  reasonsRequested: false,
  alternativesConsidered: false,
  blanketPolicyLikelihood: "low",
  auditNotes: [],
};

export function inferBurgessMetadata(text: string): BurgessPrincipleMetadata {
  const lower = text.toLowerCase();
  const blanketPolicyDetected = /blanket|policy|standard procedure|everyone|same rule|can't make exceptions/.test(lower);
  const sovereignQuestionAsked = /individual|specific situation|circumstances|consider/.test(lower);
  const decisionMakerIdentified = /name and role|manager|decision maker|who made/.test(lower);
  const reasonsRequested = /reason|explain|why|in writing/.test(lower);
  const alternativesConsidered = /alternative|another way|option|adjustment/.test(lower);

  return {
    sovereignQuestionAsked,
    blanketPolicyDetected,
    decisionMakerIdentified,
    reasonsRequested,
    alternativesConsidered,
    blanketPolicyLikelihood: blanketPolicyDetected ? "high" : sovereignQuestionAsked ? "medium" : "low",
    auditNotes: [],
  };
}
