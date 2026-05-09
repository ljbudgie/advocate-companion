import type { AdjustmentRequest, SensoryAccessProfile, SyncScope } from "@/domain/advocacy";

export interface EcosystemClientOptions {
  enabled: boolean;
  syncScope: SyncScope;
}

export interface MirrorTemplateResult {
  applicableRights: string[];
  suggestedQuestions: string[];
  templateFragments: string[];
  escalationRoutes: string[];
  caveats: string[];
}

export interface NexusTaskResult {
  summary: string;
  nextSteps: string[];
  warnings: string[];
}

export interface OpenHearImportResult {
  sensoryProfile: SensoryAccessProfile;
  consentNotice: string;
}

function disabledClientMessage(serviceName: string): string {
  return `${serviceName} integration is not configured. This client boundary is ready for a consent-scoped endpoint.`;
}

export async function fetchMirrorTemplates(
  _request: AdjustmentRequest,
  options: EcosystemClientOptions,
): Promise<MirrorTemplateResult> {
  if (!options.enabled) throw new Error(disabledClientMessage("Mirror"));
  throw new Error(disabledClientMessage("Mirror"));
}

export async function runNexusTask(
  _request: AdjustmentRequest,
  options: EcosystemClientOptions,
): Promise<NexusTaskResult> {
  if (!options.enabled) throw new Error(disabledClientMessage("nexus-ai-hub"));
  throw new Error(disabledClientMessage("nexus-ai-hub"));
}

export async function importOpenHearProfile(
  _profileId: string,
  options: EcosystemClientOptions,
): Promise<OpenHearImportResult> {
  if (!options.enabled) throw new Error(disabledClientMessage("OpenHear"));
  throw new Error(disabledClientMessage("OpenHear"));
}
