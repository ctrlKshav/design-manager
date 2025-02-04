import { create } from 'zustand';
import type { Conversation } from '@/types/conversation';

interface Store {
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string) => void;
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
}

export const useStore = create<Store>((set) => ({
  selectedConversationId: null,
  setSelectedConversationId: (id) => set({ selectedConversationId: id }),
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
}));