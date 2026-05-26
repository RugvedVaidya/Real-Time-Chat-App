import { create } from "zustand";

const useChatStore = create((set) => ({
  users: [],

  selectedUser: null,

  messages: [],

  setUsers: (users) =>
    set({ users }),

  setSelectedUser: (user) =>
    set({
      selectedUser: user,
    }),

  setMessages: (messages) =>
    set({
      messages,
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        message,
      ],
    })),

    typingUsers: [],

    setTypingUsers: (users) =>
    set({
        typingUsers: users,
    }),
}));

export default useChatStore;