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
  } = useChatStore();

  const messagesEndRef = useRef(null);

  // =========================================
  // Fetch Messages + Join Room
  // =========================================
  useEffect(() => {
    if (!selectedUser) return;

    // Join Chat Room
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
  // Receive Live Messages
  // =========================================
  useEffect(() => {
    socket.on(
      "receive_message",
      (message) => {
        addMessage(message);
      }
    );

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // =========================================
  // Auto Scroll
  // =========================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =========================================
  // No Chat Selected
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
          Header
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
        </div>
      </div>

      {/* =========================================
          Messages
      ========================================= */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
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
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* =========================================
          Input
      ========================================= */}
      <ChatInput />
    </div>
  );
};

export default ChatContainer;