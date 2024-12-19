import { Message } from "ai";
import { create } from "zustand";

interface MessagesStore {
  messages: Message[];
  visibleRange: { start: number; end: number };
  messagesCount: number;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setVisibleRange: (range: { start: number; end: number }) => void;
}

const useMessages = create<MessagesStore>((set) => ({
  messages: [],
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
}));

export default useMessages;
