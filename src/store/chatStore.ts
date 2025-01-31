import { create } from 'zustand';
import { Message, User } from '../types';

interface ChatStore {
  messages: Message[];
  users: User[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John',
    preferences: {
      tone: 'formal',
      responseStyle: 'detailed',
      expertise: ['UI/UX', 'Design Systems'],
    },
  },
  {
    id: '2',
    name: 'Sarah',
    preferences: {
      tone: 'casual',
      responseStyle: 'concise',
      expertise: ['Visual Design', 'Branding'],
    },
  },
];

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  users: mockUsers,
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
        },
      ],
    })),
  clearChat: () => set({ messages: [] }),
}));