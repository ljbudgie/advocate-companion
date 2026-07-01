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

/**
 * The Burgess Principle binary test, applied across the ecosystem
 * (burgess-principle, Mirror, OpenHear). One question decides the outcome:
 * "Was a named human being's mind applied to the specific facts of this
 * person's case before institutional power was exercised?"
 */
export const BURGESS_BINARY_QUESTION =
  "Was a human member of the team able to personally review the specific facts of my specific situation?";

/**
 * Legal grounding shared with the wider ecosystem (framework v2.6.6).
 * These operationalise the "meaningful human involvement" requirement.
 */
export const BURGESS_LEGAL_REFERENCES = [
  "Data (Use and Access) Act 2025 (s.80) / UK GDPR Articles 22A–22D (in force 5 February 2026)",
  "EU AI Act Article 14",
  "Equality Act 2010 (UK reasonable-adjustment duty)",
  "Americans with Disabilities Act (ADA, US)",
] as const;

/**
 * The three canonical outcomes of the Burgess binary test.
 * - SOVEREIGN: a named human individually reviewed the specific facts before acting.
 * - NULL: no individual human review took place; the decision was processed, not considered.
 * - AMBIGUOUS: vague process language without confirming a named reviewer looked at the specific facts.
 *
 * NULL and AMBIGUOUS are the documented starting point for escalation and repair,
 * not a final verdict.
 */
export type BurgessClassification = "SOVEREIGN" | "NULL" | "AMBIGUOUS";

export interface BurgessPrincipleMetadata {
  /** Three-outcome classification aligned with the ecosystem framework. */
  classification: BurgessClassification;
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
  classification: "AMBIGUOUS",
  sovereignQuestionAsked: false,
  blanketPolicyDetected: false,
  decisionMakerIdentified: false,
  reasonsRequested: false,
  alternativesConsidered: false,
  blanketPolicyLikelihood: "low",
  auditNotes: [],
};

/**
 * Classify a Burgess metadata signal into one of the three canonical outcomes.
 * - A named decision-maker plus evidence of individual consideration is SOVEREIGN.
 * - Detected blanket-policy language with no evidence of individual review is NULL.
 * - Anything else (unclear or vague process language) is AMBIGUOUS, which the
 *   ecosystem treats as NULL until clarified.
 */
export function classifyBurgess(
  metadata: Omit<BurgessPrincipleMetadata, "classification">,
): BurgessClassification {
  const hasIndividualConsideration =
    metadata.sovereignQuestionAsked ||
    Boolean(metadata.individualConsiderationEvidence) ||
    Boolean(metadata.alternativesConsidered);

  if (metadata.decisionMakerIdentified && hasIndividualConsideration) {
    return "SOVEREIGN";
  }

  if (metadata.blanketPolicyDetected && !hasIndividualConsideration) {
    return "NULL";
  }

  return "AMBIGUOUS";
}

export function inferBurgessMetadata(text: string): BurgessPrincipleMetadata {
  const lower = text.toLowerCase();
  const blanketPolicyDetected = /blanket|policy|standard procedure|everyone|same rule|can't make exceptions/.test(lower);
  const sovereignQuestionAsked = /individual|specific situation|circumstances|consider/.test(lower);
  const decisionMakerIdentified = /name and role|manager|decision maker|who made/.test(lower);
  const reasonsRequested = /reason|explain|why|in writing/.test(lower);
  const alternativesConsidered = /alternative|another way|option|adjustment/.test(lower);

  let blanketPolicyLikelihood: BurgessPrincipleMetadata["blanketPolicyLikelihood"] = "low";
  if (blanketPolicyDetected) {
    blanketPolicyLikelihood = "high";
  } else if (sovereignQuestionAsked) {
    blanketPolicyLikelihood = "medium";
  }

  const signal: Omit<BurgessPrincipleMetadata, "classification"> = {
    sovereignQuestionAsked,
    blanketPolicyDetected,
    decisionMakerIdentified,
    reasonsRequested,
    alternativesConsidered,
    blanketPolicyLikelihood,
    auditNotes: [],
  };

  return {
    ...signal,
    classification: classifyBurgess(signal),
  };
}
