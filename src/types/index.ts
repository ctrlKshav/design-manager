// types/index.ts
export interface Message {
  id?: string;
  content: string;
  role: 'user' | 'ai' | 'admin' | 'system';
  timestamp?: number;
  attachments?: Attachment[];
}

export interface Attachment {
  type: 'image' | 'url';
  content: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  // ... other conversation properties
}