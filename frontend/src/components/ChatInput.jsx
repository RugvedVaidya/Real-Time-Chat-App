import { useState } from "react";

import useChatStore from "../store/useChatStore";

import socket from "../sockets/socket";

const ChatInput = () => {
  const [message, setMessage] =
    useState("");

  const { selectedUser } =
    useChatStore();

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("private_message", {
      receiverId:
        selectedUser._id,
      content: message,
    });

    socket.emit("stop_typing", {
      receiverId:
        selectedUser._id,
    });

    setMessage("");
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", {
      receiverId:
        selectedUser._id,
    });

    setTimeout(() => {
      socket.emit(
        "stop_typing",
        {
          receiverId:
            selectedUser._id,
        }
      );
    }, 1000);
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={handleTyping}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          sendMessage()
        }
        className="flex-1 bg-slate-100 rounded-2xl px-6 py-4 outline-none text-slate-700 placeholder:text-slate-400"
      />

      <button
        onClick={sendMessage}
        className="bg-blue-500 hover:bg-blue-600 transition text-white px-8 py-4 rounded-2xl font-medium"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;