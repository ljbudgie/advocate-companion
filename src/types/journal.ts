export interface JournalEntry {
  id: string;
  title: string;
  recipient: string;
  context: string;
  messageSent: string;
  dateSent: string;
  status: 'pending' | 'agreed' | 'refused' | 'ignored' | 'partial';
  theirResponse?: string;
  followUps: {
    date: string;
    content: string;
    generatedBy: 'ai' | 'user';
  }[];
}
