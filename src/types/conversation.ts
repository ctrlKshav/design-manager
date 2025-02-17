export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  role: 'ai' | 'user' | 'admin' | 'system';
  user: User;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  designer: User;
  messages: Message[];
  status: 'new' | 'reviewed' | 'archived';
  lastMessage: Message;
  unreadCount: number;
}