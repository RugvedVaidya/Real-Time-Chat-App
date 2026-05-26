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

    onlineUsers: [],

    setOnlineUsers: (users) => set({
        onlineUsers: users,
    }),

    updateMessageStatus: (
    messageId,
    status
    ) =>
    set((state) => ({
        messages: state.messages.map(
        (message) =>
            message._id === messageId
            ? {
                ...message,
                status,
                }
            : message
        ),
    })),

}));

export default useChatStore;