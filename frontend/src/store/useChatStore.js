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

    updateLastMessage: (
  userId,
  message
) =>
  set((state) => ({
    users: state.users
      .map((user) =>
        user._id === userId
          ? {
              ...user,
              lastMessage:
                message,
            }
          : user
      )
      .sort((a, b) => {
        const aTime = a.lastMessage
          ? new Date(
              a.lastMessage.createdAt
            )
          : 0;

        const bTime = b.lastMessage
          ? new Date(
              b.lastMessage.createdAt
            )
          : 0;

        return bTime - aTime;
      }),
  })),
}));

export default useChatStore;