// types/index.ts
export interface Message {
  id?: string;
  content: string;
  role: 'user' | 'ai' | 'admin' | 'system';
  timestamp?: number;
  attachments?: Attachment[];
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
  isRead?: boolean;
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