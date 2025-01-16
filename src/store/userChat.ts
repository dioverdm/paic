import { Message, generateId } from "ai";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChatMessage extends Message {
  model: string;
  provider: string;
}

type Chat = {
  id: string;
  title: string;
  model: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
};

type ChatIndex = { [key: string]: Chat };

interface ChatState {
  chat: Chat[];
  chatIndex: ChatIndex;
  getAllChats: () => Chat[];
  getChat: (id: string) => Chat | undefined;
  createChat: (model: string, messages: ChatMessage[]) => Promise<string>;
  updateChat: (id: string, messages: ChatMessage[]) => void;
  deleteChat: (id: string) => void;
  addMessage: (id: string, message: ChatMessage) => void;
  // updateMessage: (id: string, message: ChatMessage) => void;
  // deleteMessage: (id: string, messageId: string) => void;
  // clearChat: (id: string) => void;
  clearAllChats: () => void;
  updateChatTitle: (id: string, title: string) => void;
}

export const useUserChat = create<ChatState>()(
  persist(
    (set, get) => ({
      chat: [],
      chatIndex: {},
      getAllChats: () => get().chat,
      getChat: (id: string) => {
        return get().chatIndex[id];
      },
      createChat: async (model: string, messages: ChatMessage[]) => {
        const id = generateId();
        // Get title suggestion from API using messages
        const response = await fetch("/api/completion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messages.slice(0, 2), // Send first two messages for context
          }),
        });

        const { title = "New Chat", error } = await response.json();

        if (error) {
          throw new Error(error);
        }
        set((state) => {
          const newChat = {
            id,
            title,
            model,
            messages,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return {
            chat: [...state.chat, newChat],
            chatIndex: { ...state.chatIndex, [id]: newChat },
          };
        });
        return id;
      },
      updateChat: (id: string, messages: ChatMessage[]) => {
        set((state) => {
          const chat = state.chatIndex[id];
          if (!chat) return state;

          const updatedChat = {
            ...chat,
            messages,
            updatedAt: new Date(),
          };

          return {
            chat: state.chat.map((c) => (c.id === id ? updatedChat : c)),
            chatIndex: { ...state.chatIndex, [id]: updatedChat },
          };
        });
      },
      deleteChat: (id: string) => {
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...remainingChats } = state.chatIndex;
          return {
            chat: state.chat.filter((c) => c.id !== id),
            chatIndex: remainingChats,
          };
        });
      },
      clearAllChats: () => {
        set({ chat: [], chatIndex: {} });
      },
      addMessage: (id: string, message: ChatMessage) => {
        set((state) => {
          const chat = state.chatIndex[id];
          if (!chat) return state;

          const updatedChat = {
            ...chat,
            messages: [...chat.messages, message],
            updatedAt: new Date(),
          };

          return {
            chat: state.chat.map((c) => (c.id === id ? updatedChat : c)),
            chatIndex: { ...state.chatIndex, [id]: updatedChat },
          };
        });
      },
      updateChatTitle: (id: string, title: string) => {
        set((state) => {
          const chat = state.chatIndex[id];
          if (!chat) return state;

          const updatedChat = {
            ...chat,
            title,
            updatedAt: new Date(),
          };

          return {
            chat: state.chat.map((c) => (c.id === id ? updatedChat : c)),
            chatIndex: { ...state.chatIndex, [id]: updatedChat },
          };
        });
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
