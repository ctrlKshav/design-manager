export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'url';
    content: string;
  }[];
  tags?: string[];
  isAiResponse?: boolean;
}

export interface User {
  id: string;
  name: string;
  preferences: {
    tone: 'formal' | 'casual' | 'friendly';
    responseStyle: 'detailed' | 'concise';
    expertise: string[];
  };
}