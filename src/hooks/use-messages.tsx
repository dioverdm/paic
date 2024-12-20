import { generateId, Message } from "ai";
import { create } from "zustand";

interface Chat {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface MessagesStore {
  messages: Message[];
  chats: Chat[];
  visibleRange: { start: number; end: number };
  messagesCount: number;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setVisibleRange: (range: { start: number; end: number }) => void;
  createChat: (name: string, messages: Message[]) => string;
  getChat: (chatId: string) => Chat | undefined;
}

const useMessages = create<MessagesStore>((set, get) => ({
  messages: [],
  chats: [],
  createChat: (name: string, messages: Message[]) => {
    const chatId = generateId();
    const newChat: Chat = {
      id: chatId,
      name,
      messages,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      chats: [...state.chats, newChat],
    }));

    return chatId;
  },
  visibleRange: { start: 0, end: 20 }, // Default visible range
  messagesCount: 0, // Track message count
  setMessages: (messages) =>
    set({
      messages,
      messagesCount: messages.length,
    }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      messagesCount: state.messages.length + 1,
    })),
  clearMessages: () =>
    set({
      messages: [],
      messagesCount: 0,
    }),
  setVisibleRange: (range) => set({ visibleRange: range }),
  getChat: (chatId: string) => {
    const state = get();
    return state.chats.find((chat) => chat.id === chatId);
  },
}));

export default useMessages;
