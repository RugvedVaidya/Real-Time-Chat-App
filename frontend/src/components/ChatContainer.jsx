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
    updateLastMessage,
  } = useChatStore();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;

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

  useEffect(() => {
    socket.on(
      "receive_message",
      (message) => {
        addMessage(message);

        updateLastMessage(
          message.senderId ===
            selectedUser?._id
            ? selectedUser._id
            : message.receiverId,
          message
        );
      }
    );

    socket.on(
      "message_delivered",
      ({ messageId, status }) => {
        updateMessageStatus(
          messageId,
          status
        );
      }
    );

    socket.on(
      "message_seen_update",
      ({ messageId, status }) => {
        updateMessageStatus(
          messageId,
          status
        );
      }
    );

    socket.on(
      "user_typing",
      ({ senderId }) => {
        setTypingUsers([senderId]);
      }
    );

    socket.on(
      "user_stop_typing",
      () => {
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
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc]">
        <h1 className="text-5xl font-bold text-slate-300">
          ChatFlow
        </h1>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc]">
      {/* HEADER */}
      <div className="h-[90px] bg-white border-b border-slate-200 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
              {selectedUser.username
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          </div>

          <div>
            <h2 className="font-bold text-slate-900 text-lg">
              {selectedUser.username}
            </h2>

            <p className="text-sm text-green-500">
              {typingUsers.includes(
                selectedUser._id
              )
                ? "typing..."
                : "Online"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xl text-slate-500">
          <button>📞</button>
          <button>ℹ️</button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-3">
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
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              status={message.status}
            />
          )
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="bg-white border-t border-slate-200 px-6 py-4">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatContainer;