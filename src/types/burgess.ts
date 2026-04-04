export interface UserProfile {
  fullName: string;
  adjustment: string;
  country: string;
  context: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'staff-display';
  content: string;
  timestamp: Date;
}
