import { Message } from "ai";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Interface representing a single chat session
 */
interface Chat {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface defining the chat store's state and actions
 */
interface ChatStore {
  chats: Chat[];
  createChat: (name: string, messages?: Message[]) => string;
  updateChat: (chatId: string, messages: Message[]) => void;
  deleteChat: (chatId: string) => void;
  getChat: (chatId: string) => Chat | undefined;
  getAllChats: () => Chat[];
}

export const useChat = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],

      createChat: (name, messages = []) => {
        const chatId = crypto.randomUUID();
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

      updateChat: (chatId, messages) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages, updatedAt: new Date() }
              : chat
          ),
        }));
      },

      deleteChat: (chatId) => {
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
        }));
      },

      getChat: (chatId: string) => {
        const { chats } = get();
        return chats.find((chat) => chat.id === chatId);
      },

      getAllChats: () => get().chats,
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),
      //   partialize: (state) => ({
      //     ...state,
      //     chats: state.chats.map((chat) => ({
      //       ...chat,
      //       createdAt: chat.createdAt?.toISOString(),
      //       updatedAt: chat.updatedAt?.toISOString(),
      //     })),
      //   }),
    }
  )
);
