import type { BurgessPrincipleMetadata, AdjustmentSetting } from "@/domain/advocacy";

export interface JournalEntry {
  id: string;
  title: string;
  recipient: string;
  institutionName?: string;
  staffRole?: string;
  decisionMaker?: string;
  policyCited?: string;
  refusalReason?: string;
  setting?: AdjustmentSetting;
  context: string;
  messageSent: string;
  dateSent: string;
  status: 'pending' | 'agreed' | 'refused' | 'ignored' | 'partial';
  theirResponse?: string;
  conversationId?: string;
  caseFileId?: string;
  adjustmentRequestId?: string;
  burgess?: BurgessPrincipleMetadata;
  followUps: {
    date: string;
    content: string;
    generatedBy: 'ai' | 'user';
  }[];
}
