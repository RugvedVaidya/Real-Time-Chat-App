import {
  useEffect,
  useRef,
} from "react";

import axiosInstance from "../lib/axios";

import useChatStore from "../store/useChatStore";

import MessageBubble from "./MessageBubble";

import ChatInput from "./ChatInput";

import socket from "../sockets/socket";

const ChatContainer = () => {
  const {
    selectedUser,
    messages,
    setMessages,
    addMessage,
    typingUsers,
    setTypingUsers,
    updateMessageStatus,
  } = useChatStore();

  const messagesEndRef = useRef(null);

  // =========================================
  // FETCH MESSAGES + JOIN ROOM
  // =========================================
  useEffect(() => {
    if (!selectedUser) return;

    // Join Room
    socket.emit("join_chat", {
      userId: selectedUser._id,
    });

    const fetchMessages =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "accessToken"
            );

          const response =
            await axiosInstance.get(
              `/messages/${selectedUser._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setMessages(response.data);
        } catch (error) {
          console.error(error);
        }
      };

    fetchMessages();
  }, [selectedUser]);

  // =========================================
  // RECEIVE LIVE SOCKET EVENTS
  // =========================================
  useEffect(() => {
    // Receive Messages
    socket.on(
      "receive_message",
      (message) => {
        addMessage(message);
      }
    );

    // Message Delivered
    socket.on(
      "message_delivered",
      ({ messageId, status }) => {
        updateMessageStatus(
          messageId,
          status
        );
      }
    );

    // Message Seen
    socket.on(
      "message_seen_update",
      ({ messageId, status }) => {
        updateMessageStatus(
          messageId,
          status
        );
      }
    );

    // Typing
    socket.on(
      "user_typing",
      ({ senderId }) => {
        setTypingUsers([senderId]);
      }
    );

    // Stop Typing
    socket.on(
      "user_stop_typing",
      ({ senderId }) => {
        setTypingUsers([]);
      }
    );

    return () => {
      socket.off("receive_message");

      socket.off(
        "message_delivered"
      );

      socket.off(
        "message_seen_update"
      );

      socket.off("user_typing");

      socket.off(
        "user_stop_typing"
      );
    };
  }, []);

  // =========================================
  // MARK MESSAGES AS SEEN
  // =========================================
  useEffect(() => {
    if (!selectedUser) return;

    messages.forEach((message) => {
      if (
        message.senderId ===
          selectedUser._id &&
        message.status !== "seen"
      ) {
        socket.emit("message_seen", {
          messageId: message._id,
          senderId: selectedUser._id,
        });
      }
    });
  }, [messages]);

  // =========================================
  // AUTO SCROLL
  // =========================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =========================================
  // NO CHAT SELECTED
  // =========================================
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-2xl">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white">
      {/* =========================================
          HEADER
      ========================================= */}
      <div className="h-[80px] border-b border-slate-800 flex items-center px-6">
        <div>
          <h2 className="font-bold text-lg">
            {selectedUser.username}
          </h2>

          <p
            className={`text-sm ${
              selectedUser.status ===
              "online"
                ? "text-green-500"
                : "text-slate-400"
            }`}
          >
            {selectedUser.status}
          </p>

          {typingUsers.includes(
            selectedUser._id
          ) && (
            <p className="text-sm text-blue-400">
              typing...
            </p>
          )}
        </div>
      </div>

      {/* =========================================
          MESSAGES
      ========================================= */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(
          (message, index) => (
            <MessageBubble
              key={index}
              ownMessage={
                message.senderId !==
                selectedUser._id
              }
              content={message.content}
              time={new Date(
                message.createdAt
              ).toLocaleTimeString()}
              status={message.status}
            />
          )
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* =========================================
          INPUT
      ========================================= */}
      <ChatInput />
    </div>
  );
};

export default ChatContainer;