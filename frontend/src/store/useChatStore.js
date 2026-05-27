import { create } from "zustand";

const useChatStore = create(
  (set) => ({
    // =========================================
    // USERS / CONVERSATIONS
    // =========================================
    users: [],

    conversations: [],

    selectedUser: null,

    onlineUsers: [],

    typingUsers: [],

    // =========================================
    // MESSAGES
    // =========================================
    messages: [],

    // =========================================
    // SETTERS
    // =========================================
    setUsers: (users) =>
      set({ users }),

    setConversations: (
      conversations
    ) =>
      set({
        conversations,
      }),

    setSelectedUser: (
      selectedUser
    ) =>
      set({
        selectedUser,
      }),

    setOnlineUsers: (
      onlineUsers
    ) =>
      set({
        onlineUsers,
      }),

    setTypingUsers: (
      typingUsers
    ) =>
      set({
        typingUsers,
      }),

    setMessages: (
      messages
    ) =>
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

    // =========================================
    // MESSAGE STATUS
    // =========================================
    updateMessageStatus: (
      messageId,
      status
    ) =>
      set((state) => ({
        messages:
          state.messages.map(
            (message) =>
              message._id ===
              messageId
                ? {
                    ...message,
                    status,
                  }
                : message
          ),
      })),

    // =========================================
    // CONVERSATION UPDATE
    // =========================================
    updateConversation: (message) =>
  set((state) => {
    const updatedConversations =
      state.conversations.map(
        (conversation) => {
          const isConversation =
            conversation._id ===
              message.senderId ||
            conversation._id ===
              message.receiverId;

          if (isConversation) {
            return {
              ...conversation,
              lastMessage:
                message,
              updatedAt:
                new Date(),
            };
          }

          return conversation;
        }
      );

    updatedConversations.sort(
      (a, b) =>
        new Date(
          b.updatedAt
        ) -
        new Date(a.updatedAt)
    );

    return {
      conversations:
        updatedConversations,
    };
  }),

    // =========================================
    // UNREAD COUNTS
    // =========================================
    incrementUnread: (userId) =>
  set((state) => ({
    conversations:
      state.conversations.map(
        (conversation) => {
          if (
            conversation._id ===
            userId
          ) {
            return {
              ...conversation,
              unreadCount:
                (conversation.unreadCount ||
                  0) + 1,
            };
          }

          return conversation;
        }
      ),
  })),

    clearUnread: (userId) =>
  set((state) => ({
    conversations:
      state.conversations.map(
        (conversation) => {
          if (
            conversation._id ===
            userId
          ) {
            return {
              ...conversation,
              unreadCount: 0,
            };
          }

          return conversation;
        }
      ),
  })),
  })
);

export default useChatStore;